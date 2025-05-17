import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await api.get("/orders");
        
        const ordersWithTotal = response.data.map(order => {
          const total = order.orderItems.reduce((sum, item) => {
            return sum + (item.product.price * item.quantity);
          }, 0);
          
          return { ...order, total };
        });
        
        setOrders(ordersWithTotal);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    console.log(orders);
  }, [orders]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>Error: {error}</p>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">My Orders</h1>
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-600 mb-6">
            You haven't placed any orders yet
          </p>
          <Link
            to="/"
            className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-md"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">My Orders</h1>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {orders.map((order) => (
          <div
            key={order.id}
            className="border-b border-gray-200 last:border-b-0"
          >
            <div className="p-6">
              <div className="flex flex-wrap justify-between items-center mb-4">
                <div>
                  <h2 className="text-lg font-semibold">Order #{order.id}</h2>
                  <p className="text-sm text-gray-500">
                    Placed on {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="mt-2 sm:mt-0">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium 
                      ${
                        order.status === "paid"
                          ? "bg-green-100 text-green-800"
                          : order.status === "pending"
                          ? "bg-blue-100 text-blue-800"
                          : order.status === "cancelled"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                  >
                    {order.status.charAt(0).toUpperCase() +
                      order.status.slice(1)}
                  </span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h3 className="font-medium mb-2">Items</h3>
                <div className="space-y-2">
                  {order.orderItems.map((item) => (
                    <div key={item.id} className="flex justify-between">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gray-200 rounded mr-3"></div>
                        <div>
                          <p className="font-medium">{item.product.name}</p>
                          <p className="text-sm text-gray-500">
                            Qty: {item.quantity}
                          </p>
                        </div>
                      </div>
                      <p className="font-medium">
                        ${item.product.price * item.quantity}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-200 mt-4 pt-4 flex justify-between">
                <p className="font-medium">Total</p>
                <p className="font-bold">${order.total.toFixed(2)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersPage;
