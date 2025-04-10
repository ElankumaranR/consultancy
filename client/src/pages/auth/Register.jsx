import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await register(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError("Failed to create account. Try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-black via-gray-900 to-gray-800">
      <div className="w-[350px] bg-gray-900 bg-opacity-80 backdrop-blur-lg p-8 shadow-xl rounded-lg border border-gray-700">
        <h2 className="text-3xl font-bold text-white text-center mb-6">Register</h2>
        
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 bg-gray-800 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 bg-gray-800 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
            required
          />
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-500 transition p-3 text-white font-semibold rounded-lg shadow-md"
          >
            Register🚀
          </button>
        </form>

        <p className="text-center text-gray-400 mt-4">
          Already a rider? 
          <a href="/" className="text-green-400 hover:text-green-300 transition ml-1">Login Here</a>
        </p>
      </div>
    </div>
  );
};

export default Register;
