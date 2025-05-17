import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  removeFromCart,
  updateQuantity,
  clearCart,
  setShippingAddress,
  createOrder,
  clearError,
  initiatePayment,
} from "../store/slices/cartSlice";

const CartPage = () => {
  const { items, shippingAddress, orderStatus, payementStatus, error } = useSelector(
    (state) => state.cart
  );
  const { isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [address, setAddress] = useState(shippingAddress);

  const isLoading = orderStatus === "loading" || payementStatus === "loading";

  useEffect(() => {
    if (orderStatus === "succeeded" && payementStatus === "succeeded") {
      dispatch(clearError());
    }
    return () => {
      dispatch(clearError());
    };
  }, [dispatch, orderStatus, payementStatus]);

  useEffect(() => {
    console.log("Order status:", orderStatus, "Payment status:", payementStatus);
  }, [orderStatus, payementStatus]);

  const totalPrice = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handleQuantityChange = (id, quantity) => {
    dispatch(updateQuantity({ id, quantity: Math.max(1, quantity) }));
  };

  const handleRemoveItem = (id) => {
    dispatch(removeFromCart(id));
  };

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: "/cart" } });
      return;
    }

    if (!address.trim()) {
      dispatch({
        type: "cart/createOrder/rejected",
        payload: "Please enter a shipping address",
      });
      return;
    }

    dispatch(setShippingAddress(address));
    try {
      const result = await dispatch(createOrder()).unwrap();

      let sessionInfos = {};
      if (result) {
        sessionInfos = await dispatch(initiatePayment(result.id)).unwrap();
      }

      console.log(sessionInfos);
      if (sessionInfos && sessionInfos.url) {
        window.location.href = sessionInfos.url;
      } else {
        console.error("Failed to initiate payment");
      }
    } catch (err) {
      console.error("Failed to create order:", err);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Your Cart</h1>
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-600 mb-6">Your cart is empty</p>
          <Link
            to="/"
            className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-md"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Your Cart</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 flex justify-between items-center">
          <p>{error}</p>
          <button
            onClick={() => dispatch(clearError())}
            className="text-red-700 hover:text-red-900"
          >
            ×
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4 text-left">Product</th>
                  <th className="py-3 px-4 text-center">Quantity</th>
                  <th className="py-3 px-4 text-right">Price</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-t border-gray-200">
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        {item.imageUrl && (
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded mr-4"
                          />
                        )}
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {item.name}
                          </h3>
                          {item.description && (
                            <p className="text-sm text-gray-500 truncate max-w-xs">
                              {item.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-center">
                        <button
                          onClick={() =>
                            handleQuantityChange(item.id, item.quantity - 1)
                          }
                          className="bg-gray-200 text-gray-700 px-2 py-1 rounded-l"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) =>
                            handleQuantityChange(
                              item.id,
                              parseInt(e.target.value)
                            )
                          }
                          className="w-12 text-center border-t border-b border-gray-200 py-1"
                        />
                        <button
                          onClick={() =>
                            handleQuantityChange(item.id, item.quantity + 1)
                          }
                          className="bg-gray-200 text-gray-700 px-2 py-1 rounded-r"
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div>
                        <p className="font-medium text-gray-900">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-500">
                          ${item.price.toFixed(2)} each
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="p-4 border-t border-gray-200 flex justify-between">
              <button
                onClick={() => dispatch(clearCart())}
                className="text-red-500 hover:text-red-700"
              >
                Clear Cart
              </button>
              <Link to="/" className="text-primary hover:text-primary-dark">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>

        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-bold mb-4">Order Summary</h2>

            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">Free</span>
              </div>
              <div className="border-t border-gray-200 my-4"></div>
              <div className="flex justify-between">
                <span className="font-bold">Total</span>
                <span className="font-bold">${totalPrice.toFixed(2)}</span>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-medium mb-2">Shipping Address</h3>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full border border-gray-300 rounded p-2 text-sm"
                rows="3"
                placeholder="Enter your shipping address"
              ></textarea>
            </div>

            <button
              onClick={handleCheckout}
              disabled={isLoading || !address}
              className={`w-full py-3 px-4 rounded-md text-white font-medium ${
                isLoading || !address
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-primary hover:bg-primary-dark"
              }`}
            >
              {isLoading ? "Processing..." : "Proceed to Checkout"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
