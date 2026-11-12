
import { useState } from "react";
import axios from "axios";
import { Eye, EyeOff, Building2 } from "lucide-react";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const response = await axios.post(
        "http://localhost:5000/api/v1/auth/login",
        { email, password },
        { withCredentials: true }
      );

      const { accessToken, user } = response.data.data;

      localStorage.setItem("token", accessToken);
      localStorage.setItem("user", JSON.stringify(user));

      onLogin(user);
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-awadh-gold text-white">
            <Building2 size={30} />
          </div>

          <h1 className="text-2xl font-bold text-awadh-navy">
            AWADH INTERIOR
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Interior Management System
          </p>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-slate-900">
            Welcome Back
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Sign in to manage your business.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-awadh-gold focus:ring-2 focus:ring-awadh-gold/20"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full rounded-lg border border-slate-300 px-4 py-3 pr-12 outline-none focus:border-awadh-gold focus:ring-2 focus:ring-awadh-gold/20"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
              >
                {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
              </button>
            </div>
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-awadh-gold py-3 font-semibold text-white hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} Awadh Interior. All rights reserved.
        </p>
      </div>
    </div>
  );
}

export default Login;
