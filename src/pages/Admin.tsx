import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import "./Admin.css";

type Order = {
  id: string;
  userId: string;
  symbol: string;
  type: "BUY" | "SELL";
  quantity: number;
  price: number;
  status: "PENDING" | "FILLED" | "CANCELLED";
  createdAt: string;
  user?: {
    id: string;
    email: string;
    fullName: string;
  } | null;
};

const API_BASE =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
    ? "http://localhost:4002"
    : "";

function Admin() {
  const [token, setToken] = useState(
    () => localStorage.getItem("aqr_admin_token") || "",
  );

  const [email, setEmail] = useState("admin@aqrcapital.com");
  const [password, setPassword] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function loadOrders(currentToken = token) {
    if (!currentToken) return;

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        `${API_BASE}/admin-api/orders/pending`,
        {
          headers: {
            Authorization: `Bearer ${currentToken}`,
          },
        },
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Unable to load pending orders",
        );
      }

      setOrders(result.data || []);
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to load orders",
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleLogin(event: FormEvent) {
    event.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        `${API_BASE}/admin-api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        },
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Admin login failed",
        );
      }

      const nextToken = result.data.token;

      localStorage.setItem(
        "aqr_admin_token",
        nextToken,
      );

      setToken(nextToken);
      setPassword("");

      await loadOrders(nextToken);
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Admin login failed",
      );
    } finally {
      setLoading(false);
    }
  }

  async function executeOrder(
    orderId: string,
    action: "fill" | "cancel",
  ) {
    const confirmed = window.confirm(
      action === "fill"
        ? "Confirm FILLED this order?"
        : "Confirm CANCEL this order?",
    );

    if (!confirmed) return;

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        `${API_BASE}/admin-api/orders/${orderId}/${action}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            `Unable to ${action} order`,
        );
      }

      setMessage(
        action === "fill"
          ? "Order filled successfully."
          : "Order cancelled successfully.",
      );

      await loadOrders(token);
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Operation failed",
      );
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    localStorage.removeItem("aqr_admin_token");
    setToken("");
    setOrders([]);
  }

  useEffect(() => {
    if (token) {
      loadOrders(token);
    }
  }, []);

  if (!token) {
    return (
      <main className="admin-page admin-login-page">
        <div className="admin-login-card">
          <div className="admin-brand">
            <div className="admin-brand-mark">A</div>

            <div>
              <h1>AQR Capital</h1>
              <span>ADMIN CONTROL PANEL</span>
            </div>
          </div>

          <form onSubmit={handleLogin}>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              autoComplete="username"
              required
            />

            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              autoComplete="current-password"
              required
            />

            {message && (
              <div className="admin-message error">
                {message}
              </div>
            )}

            <button
              className="admin-primary-button"
              type="submit"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Admin Sign In"}
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="admin-page">
      <header className="admin-header">
        <div>
          <div className="admin-eyebrow">
            AQR CAPITAL
          </div>

          <h1>Admin Control Panel</h1>

          <p>
            Order execution and customer portfolio
            management
          </p>
        </div>

        <div className="admin-header-actions">
          <button
            onClick={() => loadOrders(token)}
            disabled={loading}
          >
            Refresh
          </button>

          <button
            className="logout-button"
            onClick={logout}
          >
            Logout
          </button>
        </div>
      </header>

      {message && (
        <div className="admin-message success">
          {message}
        </div>
      )}

      <section className="admin-stats">
        <div className="admin-stat-card">
          <span>Pending Orders</span>
          <strong>{orders.length}</strong>
        </div>

        <div className="admin-stat-card">
          <span>Execution Mode</span>
          <strong>MANUAL</strong>
        </div>

        <div className="admin-stat-card">
          <span>Access</span>
          <strong>ADMIN</strong>
        </div>
      </section>

      <section className="admin-card">
        <div className="admin-card-header">
          <div>
            <h2>Pending Orders</h2>
            <p>
              Customer orders awaiting Admin execution
            </p>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="admin-empty">
            No pending orders.
          </div>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Symbol</th>
                  <th>Type</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Total</th>
                  <th>Created</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {orders.map((order) => {
                  const total =
                    order.quantity * order.price;

                  return (
                    <tr key={order.id}>
                      <td>
                        <strong>
                          {order.user?.fullName ||
                            "Customer"}
                        </strong>

                        <small>
                          {order.user?.email || ""}
                        </small>
                      </td>

                      <td>
                        <strong>{order.symbol}</strong>
                      </td>

                      <td>
                        <span
                          className={`order-type ${
                            order.type === "BUY"
                              ? "buy"
                              : "sell"
                          }`}
                        >
                          {order.type}
                        </span>
                      </td>

                      <td>{order.quantity}</td>

                      <td>
                        RM
                        {order.price.toFixed(2)}
                      </td>

                      <td>
                        RM
                        {total.toFixed(2)}
                      </td>

                      <td>
                        {new Date(
                          order.createdAt,
                        ).toLocaleString("en-MY")}
                      </td>

                      <td>
                        <div className="action-group">
                          <button
                            className="fill-button"
                            onClick={() =>
                              executeOrder(
                                order.id,
                                "fill",
                              )
                            }
                            disabled={loading}
                          >
                            Fill
                          </button>

                          <button
                            className="cancel-button"
                            onClick={() =>
                              executeOrder(
                                order.id,
                                "cancel",
                              )
                            }
                            disabled={loading}
                          >
                            Cancel
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

export default Admin;