import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { initiatePayment, clearCart } from '../store/slices/cartSlice';

const CheckoutPage = () => {
  const { items, orderId, status, error, paymentUrl, shippingAddress } = useSelector((state) => state.cart);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [paymentProcessed, setPaymentProcessed] = useState(false);
  
  const totalPrice = items.reduce((total, item) => total + (item.price * item.quantity), 0);
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }
    
    if (items.length === 0 && !paymentProcessed) {
      navigate('/cart');
      return;
    }
    
    if (orderId && !paymentUrl && !paymentProcessed) {
      dispatch(initiatePayment(orderId));
    }
  }, [dispatch, isAuthenticated, items.length, navigate, orderId, paymentUrl, paymentProcessed]);
  
  const handlePaymentSuccess = () => {
    setPaymentProcessed(true);
    dispatch(clearCart());
  };
  
  const handlePaymentCancel = () => {
    navigate('/cart');
  };
  
  if (status === 'loading') {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-lg mx-auto bg-white rounded-lg shadow-md p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold mb-2">Processing Your Order</h2>
          <p className="text-gray-600">Please wait while we prepare your payment...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-lg mx-auto bg-white rounded-lg shadow-md p-8">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p>{error}</p>
          </div>
          <button
            onClick={() => navigate('/cart')}
            className="w-full py-2 px-4 bg-primary hover:bg-primary-dark text-white rounded font-semibold"
          >
            Return to Cart
          </button>
        </div>
      </div>
    );
  }
  
  if (paymentProcessed) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-lg mx-auto bg-white rounded-lg shadow-md p-8 text-center">
          <div className="text-green-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-4">Thank You for Your Order!</h2>
          <p className="text-gray-600 mb-6">Your order has been successfully placed and will be processed soon.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-md font-semibold"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-lg mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold mb-6 text-center">Checkout</h1>
        
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Order Summary</h2>
          <div className="border-t border-b border-gray-200 py-4">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between mb-2">
                <span>{item.name} x {item.quantity}</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 font-bold">
            <span>Total</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
        </div>
        
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Shipping Information</h2>
          <div className="bg-gray-50 p-4 rounded border border-gray-200">
            <p className="mb-1"><span className="font-medium">Name:</span> {user?.firstName} {user?.lastName}</p>
            <p><span className="font-medium">Address:</span> {shippingAddress}</p>
          </div>
        </div>
        
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Payment Method</h2>
          <div className="bg-gray-50 p-4 rounded border border-gray-200">
            <div className="flex items-center">
              <input type="radio" id="card" name="paymentMethod" checked readOnly className="mr-2" />
              <label htmlFor="card" className="flex items-center">
                <span className="mr-2">Credit/Debit Card</span>
                <div className="flex space-x-1">
                  <div className="w-8 h-5 bg-blue-600 rounded"></div>
                  <div className="w-8 h-5 bg-yellow-500 rounded"></div>
                  <div className="w-8 h-5 bg-red-500 rounded"></div>
                </div>
              </label>
            </div>
          </div>
        </div>
        
        {paymentUrl ? (
          <div className="flex space-x-4">
            <button
              onClick={handlePaymentSuccess}
              className="flex-1 py-3 bg-primary hover:bg-primary-dark text-white rounded font-semibold"
            >
              Simulate Payment Success
            </button>
            <button
              onClick={handlePaymentCancel}
              className="flex-1 py-3 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded font-semibold"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            disabled
            className="w-full py-3 bg-gray-400 text-white rounded font-semibold"
          >
            Processing Order...
          </button>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;