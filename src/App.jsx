import React, { useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [useOtp, setUseOtp] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const endpoint = useOtp ? '/api/auth/login-otp' : '/api/auth/login-password';
      const payload = useOtp ? { email, otp } : { email, password };
      const response = await axios.post(endpoint, payload);
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response.data.message || 'Login failed!');
    }
  };

  const requestOtp = async () => {
    try {
      const response = await axios.post('/api/auth/request-otp', { email });
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response.data.message || 'Failed to send OTP!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <Toaster />
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-center mb-4">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          {!useOtp && (
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          )}
          {useOtp && (
            <div className="mb-4">
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700">OTP</label>
              <input
                id="otp"
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
              <button
                type="button"
                onClick={requestOtp}
                className="text-blue-600 text-sm mt-2"
              >
                Request OTP
              </button>
            </div>
          )}
          <div className="mb-4">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={useOtp}
                onChange={(e) => setUseOtp(e.target.checked)}
                className="mr-2"
              />
              Login with OTP
            </label>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
