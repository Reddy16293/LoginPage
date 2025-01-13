import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [useOtp, setUseOtp] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const endpoint = useOtp 
        ? 'https://loginpage-cads.onrender.com/api/auth/login-otp' 
        : 'https://loginpage-cads.onrender.com/api/auth/login-password';
      
      const data = useOtp ? { email, otp } : { email, password };
      
      const response = await axios.post(endpoint, data);
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  const handleRequestOtp = async () => {
    try {
      const response = await axios.post('https://loginpage-cads.onrender.com/api/auth/request-otp', { email });
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response.data.message || "Failed to request OTP");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow-md">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        <input
          type="email"
          placeholder="Email"
          className="border p-2 w-full mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {!useOtp && (
          <input
            type="password"
            placeholder="Password"
            className="border p-2 w-full mb-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        )}
        {useOtp && (
          <>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded mb-2"
              type="button"
              onClick={handleRequestOtp}
            >
              Request OTP
            </button>
            <input
              type="text"
              placeholder="OTP"
              className="border p-2 w-full mb-4"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          </>
        )}
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded mb-2"
          type="submit"
        >
          {useOtp ? "Login with OTP" : "Login with Password"}
        </button>
        <p
          className="text-blue-500 cursor-pointer"
          onClick={() => setUseOtp(!useOtp)}
        >
          {useOtp ? "Use Password Instead" : "Use OTP Instead"}
        </p>
      </form>
    </div>
  );
}
