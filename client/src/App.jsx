
import { useEffect, useState } from "react";
import axios from "axios";

import Login from "./pages/Login";
import AdminLayout from "./layouts/AdminLayout";
import Dashboard from "./pages/Dashboard";

function App() {
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const checkLogin = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setCheckingAuth(false);
        return;
      }

      try {
        const response = await axios.get(
          "http://localhost:5000/api/v1/auth/me",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUser(response.data.data);
      } catch (error) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
      } finally {
        setCheckingAuth(false);
      }
    };

    checkLogin();
  }, []);

  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser);
  };


const handleLogout = async () => {
  try {
    await axios.post(
      "http://localhost:5000/api/v1/auth/logout",
      {},
      { withCredentials: true }
    );
  } catch (error) {
    console.error("Logout API error:", error);
  } finally {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  }
};


  if (checkingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-slate-500">Checking authentication...</p>
      </div>
    );
  }

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <AdminLayout
      user={user}
      onLogout={handleLogout}
    >
    <Dashboard />
    </AdminLayout>
  );
}

export default App;
