import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useSearchParams } from 'react-router-dom';
import { clearCart } from '../store/slices/cartSlice';

const OrderSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const orderId = searchParams.get('order_id');
  
  useEffect(() => {
    dispatch(clearCart());
  }, [dispatch]);
  
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-lg mx-auto bg-white rounded-lg shadow-md p-8 text-center">
        <div className="text-green-500 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold mb-4">Thank You for Your Order!</h1>
        <p className="text-gray-600 mb-2">Your order has been successfully placed.</p>
        {orderId && (
          <p className="text-gray-600 mb-6">Order ID: <span className="font-medium">{orderId}</span></p>
        )}
        <p className="text-gray-600 mb-8">
          We've sent a confirmation email with your order details.
        </p>
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center">
          <Link to="/" className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-md font-semibold">
            Continue Shopping
          </Link>
          <Link to="/orders" className="bg-secondary hover:bg-secondary-dark text-white px-6 py-3 rounded-md font-semibold">
            View My Orders
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;