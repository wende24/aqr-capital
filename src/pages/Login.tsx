import {
  useState,
  type FormEvent,
} from "react";

import "./Login.css";

type LoginProps = {
  onRegister: () => void;
  onLoginSuccess: () => void;
};

function Login({ onRegister, onLoginSuccess }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const [language, setLanguage] =
    useState<"BM" | "EN">("EN");

  const [currency, setCurrency] =
    useState<"MYR" | "USD">("MYR");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const toggleLanguage = () => {
    setLanguage((current) =>
      current === "EN" ? "BM" : "EN"
    );
  };

  const toggleCurrency = () => {
    setCurrency((current) =>
      current === "MYR" ? "USD" : "MYR"
    );
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setMessage("");

    if (!email.trim() || !password) {
      setMessage(
        language === "BM"
          ? "Sila masukkan e-mel dan kata laluan."
          : "Please enter your email and password.",
      );
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
            password,
          }),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        setMessage(
          result.message ||
            (language === "BM"
              ? "Log masuk gagal."
              : "Login failed."),
        );
        return;
      }

      localStorage.setItem(
        "aqr_token",
        result.data.token,
      );

      localStorage.setItem(
        "aqr_user",
        JSON.stringify(result.data.user),
      );

      setMessage(
        language === "BM"
          ? "Log masuk berjaya."
          : "Login successful.",
      );

      setTimeout(() => {
        onLoginSuccess();
      }, 500);
    } catch (error) {
      console.error("Login request failed:", error);

      setMessage(
        language === "BM"
          ? "Tidak dapat menyambung ke pelayan."
          : "Unable to connect to server.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">

      {/* =================================
          KL CITY BACKGROUND
          File:
          public/images/kl-city.png
      ================================= */}

      <div
        className="login-background"
        aria-hidden="true"
      />

      {/* =================================
          HEADER
      ================================= */}

      <header className="login-header">

        <div className="brand">

          <div className="brand-mark">
            <span />
            <span />
            <span />
          </div>

          <div className="brand-copy">
            <h1>AQR Capital</h1>

            <p>
              Melabur Bijak. Masa Depan Lebih Terjamin.
            </p>
          </div>

        </div>

        <div className="top-controls">

          <button
            type="button"
            className="control-button"
            onClick={toggleLanguage}
          >
            <span className="malaysia-flag">
              🇲🇾
            </span>

            <span
              className={
                language === "BM"
                  ? "active-control"
                  : ""
              }
            >
              BM
            </span>

            <span className="control-divider">
              |
            </span>

            <span
              className={
                language === "EN"
                  ? "active-control"
                  : ""
              }
            >
              EN
            </span>

            <span className="chevron">
              ▾
            </span>
          </button>

          <button
            type="button"
            className="currency-button"
            onClick={toggleCurrency}
          >
            {currency}

            <span className="chevron">
              ▾
            </span>
          </button>

        </div>

      </header>

      {/* =================================
          MAIN
      ================================= */}

      <section className="login-layout">

        {/* =================================
            LEFT HERO
        ================================= */}

        <div className="login-hero">

          <div className="trust-badge">

            <span>♛</span>

            <span>
              Platform Pelaburan Global
            </span>

            <i>•</i>

            <span>
              Dipercayai di Malaysia
            </span>

          </div>

          <h2>
            Selamat Datang
            <br />
            ke{" "}
            <span>AQR Capital</span>
          </h2>

          <p className="hero-description">
            Pantau pasaran, urus pelaburan
            dan berdagang dengan lebih yakin.
          </p>

          {/* =================================
              MARKET CARDS
          ================================= */}

          <div className="market-cards">

            <MarketCard
              icon="₿"
              title="BTC / MYR"
              value="RM 298,432.10"
              change="+2.35%"
              tone="blue"
            />

            <MarketCard
              icon="♦"
              title="ETH / MYR"
              value="RM 12,845.30"
              change="+1.28%"
              tone="purple"
            />

            <MarketCard
              icon="MY"
              title="KLCI"
              value="1,642.38"
              change="+0.56%"
              tone="cyan"
            />

            <MarketCard
              icon="US"
              title="USD / MYR"
              value="RM 4.7120"
              change="-0.24%"
              tone="red"
              negative
            />

          </div>

          {/* =================================
              FEATURES
          ================================= */}

          <div className="feature-grid">

            <FeatureItem
              icon="▥"
              title="Data Pasaran Masa Nyata"
              description="Pantau pasaran global dengan pantas"
            />

            <FeatureItem
              icon="♢"
              title="Selamat & Dipercayai"
              description="Perlindungan data berlapis & 2FA tersedia"
            />

            <FeatureItem
              icon="◎"
              title="Akses Global"
              description="Saham, kripto, forex dan banyak lagi"
            />

            <FeatureItem
              icon="ϟ"
              title="Dagang Mudah"
              description="Platform pantas, stabil dan mesra pengguna"
            />

          </div>

          {/* =================================
              SECURITY
          ================================= */}

          <div className="security-line">

            <span>♙</span>

            <span>
              Sambungan selamat
            </span>

            <i>|</i>

            <span>
              2FA tersedia
            </span>

            <i>|</i>

            <span>
              Dikawal selia & mematuhi
              standard keselamatan
            </span>

          </div>

        </div>

        {/* =================================
            LOGIN PANEL
        ================================= */}

        <div className="login-panel">

          <div className="panel-inner">

            <div className="panel-title">

              <h2>
                {language === "BM"
                  ? "Log Masuk"
                  : "Log In"}
              </h2>

              <p>
                {language === "BM"
                  ? "Masuk ke akaun AQR Capital anda untuk meneruskan dagangan."
                  : "Log in to your AQR Capital account to continue trading."}
              </p>

            </div>

            <form
              className="login-form"
              onSubmit={handleSubmit}
            >

              {/* EMAIL */}

              <label htmlFor="email">
                {language === "BM"
                  ? "E-mel"
                  : "Email"}
              </label>

              <div className="input-wrapper">

                <span className="input-icon">
                  ✉
                </span>

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  placeholder="nama@email.com"
                  autoComplete="email"
                />

              </div>

              {/* PASSWORD */}

              <label htmlFor="password">
                {language === "BM"
                  ? "Kata Laluan"
                  : "Password"}
              </label>

              <div className="input-wrapper">

                <span className="input-icon">
                  ♧
                </span>

                <input
                  id="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  placeholder={
                    language === "BM"
                      ? "Masukkan kata laluan anda"
                      : "Enter your password"
                  }
                  autoComplete="current-password"
                />

                <button
                  type="button"
                  className="password-button"
                  onClick={() =>
                    setShowPassword(
                      (current) => !current
                    )
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword
                    ? "◉"
                    : "◌"}
                </button>

              </div>

              {/* OPTIONS */}

              <div className="form-options">

                <label className="remember-option">

                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(event) =>
                      setRememberMe(
                        event.target.checked
                      )
                    }
                  />

                  <span className="custom-checkbox">
                    {rememberMe ? "✓" : ""}
                  </span>

                  <span>
                    {language === "BM"
                      ? "Ingat saya"
                      : "Remember me"}
                  </span>

                </label>

                <button
                  type="button"
                  className="forgot-button"
                >
                  {language === "BM"
                    ? "Lupa kata laluan?"
                    : "Forgot password?"}
                </button>

              </div>

              {/* MESSAGE */}

              {message && (
                <div className="login-message">
                  {message}
                </div>
              )}

              {/* LOGIN */}

              <button
                type="submit"
                className="login-button"
                disabled={loading}
              >
                {loading
                  ? language === "BM"
                    ? "Memproses..."
                    : "Processing..."
                  : language === "BM"
                    ? "Log Masuk"
                    : "Log In"}

                <span>→</span>
              </button>

              {/* REGISTER */}

              <div className="register-row">

                <span>
                  {language === "BM"
                    ? "Belum mempunyai akaun?"
                    : "Don't have an account?"}
                </span>

                <button
                  type="button"
                  className="register-button"
                  onClick={onRegister}
                >
                  {language === "BM"
                    ? "Daftar sekarang"
                    : "Register now"}

                  <span>→</span>
                </button>

              </div>

            </form>

          </div>

        </div>

      </section>

    </main>
  );
}

/* =================================
   MARKET CARD
================================= */

function MarketCard({
  icon,
  title,
  value,
  change,
  tone,
  negative = false,
}: {
  icon: string;
  title: string;
  value: string;
  change: string;
  tone: string;
  negative?: boolean;
}) {
  return (
    <div
      className={`market-card market-${tone}`}
    >

      <div className="market-card-top">

        <div className="market-icon">
          {icon}
        </div>

        <span>
          {title}
        </span>

      </div>

      <strong>
        {value}
      </strong>

      <div
        className={
          negative
            ? "market-change negative"
            : "market-change"
        }
      >
        {negative ? "▼" : "▲"}{" "}
        {change}
      </div>

      <div className="market-line">
        <span />
      </div>

    </div>
  );
}

/* =================================
   FEATURE ITEM
================================= */

function FeatureItem({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="feature-item">

      <div className="feature-icon">
        {icon}
      </div>

      <h3>
        {title}
      </h3>

      <p>
        {description}
      </p>

    </div>
  );
}

export default Login;
