import { useEffect, useMemo, useState } from "react";
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

type NavItem = {
  id: string;
  label: string;
  icon: string;
};

const NAV_ITEMS: NavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: "dashboard",
  },
  {
    id: "users",
    label: "Pengguna",
    icon: "users",
  },
  {
    id: "kyc",
    label: "KYC Verifikasi",
    icon: "shield",
  },
  {
    id: "deposit",
    label: "Deposit",
    icon: "deposit",
  },
  {
    id: "withdrawal",
    label: "Pengeluaran",
    icon: "withdrawal",
  },
  {
    id: "trading",
    label: "Perdagangan",
    icon: "trading",
  },
  {
    id: "markets",
    label: "Aset & Pasaran",
    icon: "markets",
  },
  {
    id: "promotion",
    label: "Promosi",
    icon: "promotion",
  },
  {
    id: "support",
    label: "Sokongan",
    icon: "support",
  },
];

const API_BASE =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
    ? "http://localhost:4002"
    : "";

const DASHBOARD_DEMO = {
  users: "500,000+",
  deposits: "RM 12,845,320",
  withdrawals: "RM 7,320,560",
  trading: "RM 298,432,100",
};

function Icon({
  name,
  size = 20,
}: {
  name: string;
  size?: number;
}) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (name) {
    case "dashboard":
      return (
        <svg {...common}>
          <rect x="4" y="4" width="6" height="6" rx="1" />
          <rect x="14" y="4" width="6" height="6" rx="1" />
          <rect x="4" y="14" width="6" height="6" rx="1" />
          <rect x="14" y="14" width="6" height="6" rx="1" />
        </svg>
      );

    case "users":
      return (
        <svg {...common}>
          <circle cx="9" cy="8" r="3" />
          <path d="M3.5 19c.8-3 2.6-4.5 5.5-4.5S13.7 16 14.5 19" />
          <path d="M15 7.5a2.6 2.6 0 1 1 0 5.1" />
          <path d="M17 14.5c2.1.4 3.3 1.8 3.6 4" />
        </svg>
      );

    case "shield":
      return (
        <svg {...common}>
          <path d="M12 3 19 6v5c0 4.5-2.7 7.7-7 10-4.3-2.3-7-5.5-7-10V6l7-3Z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      );

    case "deposit":
      return (
        <svg {...common}>
          <rect x="4" y="6" width="16" height="12" rx="2" />
          <path d="M4 10h16" />
          <path d="M8 14h4" />
        </svg>
      );

    case "withdrawal":
      return (
        <svg {...common}>
          <path d="M12 3v12" />
          <path d="m7 10 5 5 5-5" />
          <path d="M5 20h14" />
        </svg>
      );

    case "trading":
      return (
        <svg {...common}>
          <path d="m4 17 5-5 4 3 7-8" />
          <path d="M16 7h4v4" />
        </svg>
      );

    case "markets":
      return (
        <svg {...common}>
          <path d="M4 19V9" />
          <path d="M10 19V5" />
          <path d="M16 19v-7" />
          <path d="M22 19V3" />
        </svg>
      );

    case "promotion":
      return (
        <svg {...common}>
          <path d="M4 8h16v9H4z" />
          <path d="M4 11h16" />
          <path d="M8 8c-1.5-1-2-2.4-1-3.5 1-1 3 .1 5 3.5" />
          <path d="M16 8c1.5-1 2-2.4 1-3.5-1-1-3 .1-5 3.5" />
        </svg>
      );

    case "support":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M8.5 10.5a3.5 3.5 0 0 1 7 0c0 2-1.5 2.8-2.7 3.6-.7.4-.8 1-.8 1.4" />
          <path d="M12 18h.01" />
        </svg>
      );

    case "search":
      return (
        <svg {...common}>
          <circle cx="10.8" cy="10.8" r="6.2" />
          <path d="m16 16 4 4" />
        </svg>
      );

    case "bell":
      return (
        <svg {...common}>
          <path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9Z" />
          <path d="M10 21h4" />
        </svg>
      );

    case "chevron":
      return (
        <svg {...common}>
          <path d="m6 9 6 6 6-6" />
        </svg>
      );

    case "activity":
      return (
        <svg {...common}>
          <path d="M4 18V6" />
          <path d="M8 16v-5" />
          <path d="M12 18V8" />
          <path d="M16 14V5" />
          <path d="M20 18v-8" />
        </svg>
      );

    case "notice":
      return (
        <svg {...common}>
          <path d="M12 3 20 7v5c0 4-2.5 7.5-8 9-5.5-1.5-8-5-8-9V7l8-4Z" />
          <path d="M12 8v4" />
          <path d="M12 15h.01" />
        </svg>
      );

    case "menu":
      return (
        <svg {...common}>
          <path d="M4 7h16" />
          <path d="M4 12h16" />
          <path d="M4 17h16" />
        </svg>
      );

    default:
      return null;
  }
}

function AdminLogo() {
  return (
    <div className="admin-brand-mark">
      <svg
        viewBox="0 0 64 64"
        width="44"
        height="44"
        aria-hidden="true"
      >
        <defs>
          <linearGradient
            id="aqr-sidebar-gradient"
            x1="0"
            y1="0"
            x2="1"
            y2="1"
          >
            <stop offset="0%" stopColor="#27b7ff" />
            <stop offset="100%" stopColor="#1766ff" />
          </linearGradient>
        </defs>

        <path
          d="M13 45 27 17h7l14 28H38l-5-11-5 11H13Z"
          fill="url(#aqr-sidebar-gradient)"
        />

        <path
          d="M27 17 20 31h10l4-7 4 7H32l-5-14Z"
          fill="#ffffff"
          opacity="0.95"
        />
      </svg>
    </div>
  );
}

function Admin() {
  const [token, setToken] = useState(
    () => localStorage.getItem("aqr_admin_token") || "",
  );

  const [activeNav, setActiveNav] =
    useState("dashboard");

  const [search, setSearch] = useState("");

  const [language, setLanguage] =
    useState("BM");

  const [showNotifications, setShowNotifications] =
    useState(false);

  const [orders, setOrders] =
    useState<Order[]>([]);

  const [loading, setLoading] =
    useState(false);

  const pendingCount = orders.length;

  const latestActivities = useMemo(
    () => [
      {
        title: "Admin login ke sistem",
        detail: "admin@aqrcapital.com",
        time: "Baru sahaja",
        tone: "blue",
      },
      {
        title: "Pesanan pelanggan diterima",
        detail:
          pendingCount > 0
            ? `${pendingCount} pesanan sedang menunggu`
            : "Tiada pesanan baharu",
        time: "Baru sahaja",
        tone: "green",
      },
      {
        title: "Sistem portfolio dikemaskini",
        detail: "Data akaun berjaya disegerakkan",
        time: "Hari ini",
        tone: "purple",
      },
      {
        title: "Pasaran sedang dipantau",
        detail: "Market monitoring aktif",
        time: "Hari ini",
        tone: "orange",
      },
      {
        title: "Notifikasi sistem diperiksa",
        detail: "Semua servis beroperasi",
        time: "Hari ini",
        tone: "blue",
      },
    ],
    [pendingCount],
  );

  const notifications = [
    {
      title: "KYC Tertangguh",
      text: "Terdapat permohonan KYC yang menunggu semakan.",
      tone: "orange",
    },
    {
      title: "Pesanan Menunggu",
      text:
        pendingCount > 0
          ? `${pendingCount} pesanan menunggu pelaksanaan Admin.`
          : "Tiada pesanan menunggu pada masa ini.",
      tone: "red",
    },
    {
      title: "Sistem Berfungsi Normal",
      text: "Semua servis utama berjalan seperti biasa.",
      tone: "green",
    },
    {
      title: "Pasaran Aktif",
      text: "Pemantauan pasaran sedang berjalan.",
      tone: "blue",
    },
  ];

  async function loadOrders(
    currentToken = token,
  ) {
    if (!currentToken) {
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_BASE}/admin-api/orders/pending`,
        {
          headers: {
            Authorization: `Bearer ${currentToken}`,
            Accept: "application/json",
          },
        },
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Unable to load pending orders",
        );
      }

      setOrders(
        Array.isArray(result.data)
          ? result.data
          : [],
      );
    } catch (error) {
      console.error("Admin dashboard error:", error);
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    localStorage.removeItem("aqr_admin_token");
    sessionStorage.removeItem("aqr_admin_token");
    setToken("");
  }

  useEffect(() => {
    if (token) {
      void loadOrders(token);
    }
  }, [token]);

  if (!token) {
    return (
      <main className="admin-auth-page">
        <div className="admin-auth-card">
          <AdminLogo />

          <h1>Admin Log Masuk</h1>

          <p>
            Sila kembali ke halaman login Admin.
          </p>

          <a
            href="/admin"
            className="admin-auth-button"
          >
            Admin Log Masuk
          </a>

          <a
            href="/"
            className="admin-home-link"
          >
            Laman Utama
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand">
          <AdminLogo />

          <div>
            <strong>AQR Capital</strong>
            <span>ADMIN PANEL</span>
          </div>
        </div>

        <nav className="admin-sidebar-nav">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`admin-nav-item ${
                activeNav === item.id
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setActiveNav(item.id)
              }
            >
              <Icon
                name={item.icon}
                size={19}
              />

              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-sidebar-footer-logo">
            <AdminLogo />
          </div>

          <div>
            <strong>AQR Capital</strong>
            <span>Admin Panel v1.0.0</span>
          </div>
        </div>
      </aside>

      <section className="admin-main">
        <header className="admin-topbar">
          <div className="admin-top-left">
            <button
              type="button"
              className="admin-mobile-menu"
            >
              <Icon name="menu" size={22} />
            </button>

            <div className="admin-search">
              <Icon
                name="search"
                size={18}
              />

              <input
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Cari pengguna, transaksi, atau laporan..."
              />
            </div>
          </div>

          <div className="admin-top-actions">
            <button
              type="button"
              className="admin-language"
              onClick={() =>
                setLanguage(
                  language === "BM"
                    ? "EN"
                    : "BM",
                )
              }
            >
              🇲🇾
              <span>{language}</span>
              <Icon
                name="chevron"
                size={15}
              />
            </button>

            <div className="admin-notification-wrap">
              <button
                type="button"
                className="admin-icon-button"
                onClick={() =>
                  setShowNotifications(
                    !showNotifications,
                  )
                }
              >
                <Icon
                  name="bell"
                  size={20}
                />

                <span className="admin-notification-dot">
                  3
                </span>
              </button>

              {showNotifications && (
                <div className="admin-notification-popover">
                  <strong>Notifikasi</strong>

                  <span>
                    {pendingCount} pesanan pending
                  </span>

                  <span>
                    Sistem sedang berjalan normal
                  </span>
                </div>
              )}
            </div>

            <button
              type="button"
              className="admin-profile"
              onClick={logout}
            >
              <span className="admin-avatar">
                A
              </span>

              <span className="admin-profile-text">
                <strong>Admin</strong>
                <small>Super Admin</small>
              </span>

              <Icon
                name="chevron"
                size={15}
              />
            </button>
          </div>
        </header>

        <div className="admin-content">
          <div className="admin-page-heading">
            <div>
              <h1>Dashboard</h1>

              <p>
                Selamat datang, Admin. Berikut
                adalah ringkasan keseluruhan
                platform AQR Capital.
              </p>
            </div>

            <button className="admin-date-filter">
              1 Okt 2024 – 31 Okt 2024
              <Icon
                name="chevron"
                size={16}
              />
            </button>
          </div>

          {activeNav === "dashboard" ? (
            <>
              <section className="admin-stat-grid">
                <div className="admin-stat-card blue">
                  <div className="admin-stat-icon">
                    <Icon
                      name="users"
                      size={22}
                    />
                  </div>

                  <div>
                    <span>Jumlah Pengguna</span>
                    <strong>
                      {DASHBOARD_DEMO.users}
                    </strong>

                    <small className="positive">
                      ↑ +12.5% dari bulan lepas
                    </small>
                  </div>

                  <div className="admin-mini-chart blue-chart" />
                </div>

                <div className="admin-stat-card green">
                  <div className="admin-stat-icon">
                    <Icon
                      name="deposit"
                      size={22}
                    />
                  </div>

                  <div>
                    <span>Jumlah Deposit</span>
                    <strong>
                      {DASHBOARD_DEMO.deposits}
                    </strong>

                    <small className="positive">
                      ↑ +8.2% dari bulan lepas
                    </small>
                  </div>

                  <div className="admin-mini-chart green-chart" />
                </div>

                <div className="admin-stat-card purple">
                  <div className="admin-stat-icon">
                    <Icon
                      name="withdrawal"
                      size={22}
                    />
                  </div>

                  <div>
                    <span>
                      Jumlah Pengeluaran
                    </span>

                    <strong>
                      {DASHBOARD_DEMO.withdrawals}
                    </strong>

                    <small className="positive">
                      ↑ +5.6% dari bulan lepas
                    </small>
                  </div>

                  <div className="admin-mini-chart purple-chart" />
                </div>

                <div className="admin-stat-card orange">
                  <div className="admin-stat-icon">
                    <Icon
                      name="trading"
                      size={22}
                    />
                  </div>

                  <div>
                    <span>Jumlah Dagangan</span>

                    <strong>
                      {DASHBOARD_DEMO.trading}
                    </strong>

                    <small className="positive">
                      ↑ +18.4% dari bulan lepas
                    </small>
                  </div>

                  <div className="admin-mini-chart orange-chart" />
                </div>
              </section>

              <section className="admin-dashboard-grid">
                <div className="admin-panel-card">
                  <div className="admin-panel-header">
                    <div>
                      <h2>
                        Aktiviti Sistem Terkini
                      </h2>

                      <span>
                        Rekod aktiviti Admin dan
                        sistem
                      </span>
                    </div>

                    <button>
                      Lihat Semua →
                    </button>
                  </div>

                  <div className="admin-activity-list">
                    {latestActivities.map(
                      (activity, index) => (
                        <div
                          className="admin-activity-item"
                          key={`${activity.title}-${index}`}
                        >
                          <div
                            className={`admin-activity-dot ${activity.tone}`}
                          >
                            <Icon
                              name="activity"
                              size={15}
                            />
                          </div>

                          <div className="admin-activity-copy">
                            <strong>
                              {activity.title}
                            </strong>

                            <span>
                              {activity.detail}
                            </span>
                          </div>

                          <time>
                            {activity.time}
                          </time>
                        </div>
                      ),
                    )}
                  </div>
                </div>

                <div className="admin-panel-card">
                  <div className="admin-panel-header">
                    <div>
                      <h2>
                        Notis &
                        Pemberitahuan
                      </h2>

                      <span>
                        Makluman penting sistem
                      </span>
                    </div>

                    <button>
                      Lihat Semua →
                    </button>
                  </div>

                  <div className="admin-notice-list">
                    {notifications.map(
                      (notification) => (
                        <div
                          className="admin-notice-item"
                          key={notification.title}
                        >
                          <div
                            className={`admin-notice-icon ${notification.tone}`}
                          >
                            <Icon
                              name="notice"
                              size={17}
                            />
                          </div>

                          <div className="admin-notice-copy">
                            <strong>
                              {notification.title}
                            </strong>

                            <span>
                              {notification.text}
                            </span>
                          </div>

                          <button>
                            Lihat
                          </button>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              </section>

              <section className="admin-pending-card">
                <div className="admin-panel-header">
                  <div>
                    <h2>
                      Pending Orders
                    </h2>

                    <span>
                      Pesanan pelanggan yang
                      sedang menunggu
                      pelaksanaan Admin
                    </span>
                  </div>

                  <button
                    onClick={() =>
                      void loadOrders(token)
                    }
                  >
                    {loading
                      ? "Memuat..."
                      : "Refresh →"}
                  </button>
                </div>

                {orders.length === 0 ? (
                  <div className="admin-empty">
                    Tiada pesanan pending.
                  </div>
                ) : (
                  <div className="admin-order-list">
                    {orders.map((order) => (
                      <div
                        className="admin-order-item"
                        key={order.id}
                      >
                        <div>
                          <strong>
                            {order.symbol}
                          </strong>

                          <span>
                            {order.user
                              ?.fullName ||
                              "Customer"}
                          </span>
                        </div>

                        <div>
                          <span
                            className={`admin-order-type ${
                              order.type ===
                              "BUY"
                                ? "buy"
                                : "sell"
                            }`}
                          >
                            {order.type}
                          </span>
                        </div>

                        <div>
                          <strong>
                            {order.quantity}
                          </strong>

                          <span>
                            @ RM
                            {order.price.toFixed(
                              2,
                            )}
                          </span>
                        </div>

                        <div className="admin-order-total">
                          RM
                          {(
                            order.quantity *
                            order.price
                          ).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </>
          ) : (
            <section className="admin-module-placeholder">
              <div className="admin-module-icon">
                <Icon
                  name={
                    NAV_ITEMS.find(
                      (item) =>
                        item.id ===
                        activeNav,
                    )?.icon || "dashboard"
                  }
                  size={28}
                />
              </div>

              <h2>
                {
                  NAV_ITEMS.find(
                    (item) =>
                      item.id ===
                      activeNav,
                  )?.label
                }
              </h2>

              <p>
                Modul ini telah disediakan
                dalam Sidebar Admin dan akan
                disambungkan kepada API masing-masing.
              </p>

              <button
                onClick={() =>
                  setActiveNav("dashboard")
                }
              >
                Kembali ke Dashboard
              </button>
            </section>
          )}
        </div>
      </section>
    </main>
  );
}

export default Admin;