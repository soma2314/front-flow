import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import axios from "axios";
import { addEmail } from "../../app/Slice/userSlice";
import "@fortawesome/fontawesome-free/css/all.min.css";

const baseurl = import.meta.env.VITE_BASE_URL;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const res = await axios.post(
        `${baseurl}/login`,
        {
          email: email,
          password: password,
        },
        {
          withCredentials: true,
          credentials: 'include',
          headers: {
            "Content-Type": 'application/x-www-form-urlencoded'
          },
        }
      );

      dispatch(
        addEmail({
          email: res.data.user.email,
          role: res.data.user.role,
          name: res.data.user.name,
        })
      );

      toast.success("Login successful");
      navigate("/");
    } catch (ex) {
      toast.error("Login failed");
      setError(ex.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo or Brand Section */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
            Welcome Back
          </h2>
          <p className="mt-2 text-gray-400">Sign in to your account</p>
        </div>

        {/* Main Form Card */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-700 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-300 placeholder-gray-500"
                placeholder="Enter your email"
                required
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-300 placeholder-gray-500 pr-10"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                >
                  <i className={`fa ${showPassword ? "fa-eye-slash" : "fa-eye"}`} />
                </button>
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
            >
              Sign In
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-blue-400 hover:text-blue-300 font-medium hover:underline transition-colors"
              >
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;