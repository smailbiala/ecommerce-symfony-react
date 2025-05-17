import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_URL } from "../../../constant";


// Load cart state from localStorage
const loadCartState = () => {
  try {
    const serializedCart = localStorage.getItem("cart");
    if (
      serializedCart === null ||
      serializedCart === undefined ||
      serializedCart === ""
    ) {
      return { items: [], shippingAddress: "" };
    }
    return JSON.parse(serializedCart);
  } catch (err) {
    console.error("Failed to load cart state:", err);
    return { items: [], shippingAddress: "" };
  }
};

// Save cart state to localStorage
const saveCartState = (state) => {
  try {
    const serializedCart = JSON.stringify({
      items: state.items,
      shippingAddress: state.shippingAddress,
    });
    localStorage.setItem("cart", serializedCart);
  } catch (err) {
    // Handle possible errors
    console.error("Failed to save cart state:", err);
  }
};

export const createOrder = createAsyncThunk(
  "cart/createOrder",
  async (_, { getState, rejectWithValue, dispatch }) => {
    try {
      const { cart, auth } = getState();

      if (!auth.isAuthenticated) {
        return rejectWithValue("User must be logged in to create an order");
      }

      if (!cart.shippingAddress) {
        return rejectWithValue("Please provide a shipping address");
      }

      if (cart.items.length === 0) {
        return rejectWithValue("Your cart is empty");
      }

      const orderData = {
        orderItems: cart.items.map((item) => ({
          product: `/api/products/${item.id}`,
          quantity: item.quantity,
        })),
        shippingAddress: cart.shippingAddress,
      };

      const response = await axios.post(`${API_URL}/orders`, orderData, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });

      // Automatically initiate payment after order creation
      if (response.data && response.data.id) {
        dispatch(initiatePayment(response.data.id));
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create order"
      );
    }
  }
);

export const initiatePayment = createAsyncThunk(
  "cart/initiatePayment",
  async (orderId, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();

      if (!auth.isAuthenticated) {
        return rejectWithValue("User must be logged in to process payment");
      }

      const response = await axios.post(
        `${API_URL}/payment/create/${orderId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to initiate payment"
      );
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    shippingAddress: "",
    payementStatus: "idle",
    orderStatus: "idle",
    error: null,
    orderId: null,
    paymentUrl: null,
    ...(loadCartState() || {}), // Use empty object as fallback
  },
  reducers: {
    addToCart: (state, action) => {
      const { id, name, price, imageUrl } = action.payload;
      const existingItem = state.items.find((item) => item.id === id);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({
          id,
          name,
          price,
          imageUrl,
          quantity: 1,
        });
      }
      saveCartState(state);
    },
    removeFromCart: (state, action) => {
      const id = action.payload;
      state.items = state.items.filter((item) => item.id !== id);
      saveCartState(state);
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find((item) => item.id === id);
      if (item) {
        item.quantity = quantity;
      }
      saveCartState(state);
    },
    clearCart: (state) => {
      state.items = [];
      state.orderId = null;
      state.paymentUrl = null;
      saveCartState(state);
    },
    setShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      saveCartState(state);
    },
    clearError: (state) => {
      state.error = null;
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.orderStatus = "loading";
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderStatus = "succeeded";
        state.orderId = action.payload.id;
        state.error = null;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.orderStatus = "failed";
        state.error = action.payload || "An unexpected error occurred";
      })
      .addCase(initiatePayment.pending, (state) => {
        state.payementStatus = "loading";
        state.error = null;
      })
      .addCase(initiatePayment.fulfilled, (state, action) => {
        state.payementStatus = "succeeded";
        state.paymentUrl = action.payload.url;
        state.error = null;
      })
      .addCase(initiatePayment.rejected, (state, action) => {
        state.payementStatus = "failed";
        state.error = action.payload || "Failed to process payment";
      });
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  setShippingAddress,
  clearError,
} = cartSlice.actions;
export default cartSlice.reducer;
