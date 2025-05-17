import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_URL } from "../../../constant";


export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/products`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchProductsByCategory = createAsyncThunk(
  "products/fetchProductsByCategory",
  async (categoryId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/products?category.id=${categoryId}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const searchProducts = createAsyncThunk(
  "products/searchProducts",
  async (searchTerm, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/products?name=${searchTerm}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const filterProducts = createAsyncThunk(
  "products/filterProducts",
  async (filters, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters.searchTerm) {
        queryParams.append('name', filters.searchTerm);
      }
      
      if (filters.categoryId) {
        queryParams.append('category.id', filters.categoryId);
      }
      
      if (filters.minPrice !== undefined) {
        queryParams.append('price[gte]', filters.minPrice);
      }
      if (filters.maxPrice !== undefined) {
        queryParams.append('price[lte]', filters.maxPrice);
      }
      
      if (filters.inStock) {
        queryParams.append('stock[gt]', 0);
      }
      
      if (filters.sortBy) {
        queryParams.append(`order[${filters.sortBy}]`, filters.sortDirection || 'asc');
      }
      
      const response = await axios.get(`${API_URL}/products?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchCategories = createAsyncThunk(
  "products/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/categories`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch categories");
    }
  }
);

const productsSlice = createSlice({
  name: "products",
  initialState: {
    items: [],
    categories: [],
    status: "idle", 
    error: null,
    categoriesStatus: "idle", 
    categoriesError: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchProductsByCategory.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchProductsByCategory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(searchProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(filterProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(filterProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(filterProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchCategories.pending, (state) => {
        state.categoriesStatus = "loading";
        state.categoriesError = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categoriesStatus = "succeeded";
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.categoriesStatus = "failed";
        state.categoriesError = action.payload;
      });
  },
});

export default productsSlice.reducer;
