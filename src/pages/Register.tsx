import {
  useState,
  type FormEvent,
} from "react";

import "./Register.css";

type RegisterProps = {
  onLogin?: () => void;
  onBackToLogin?: () => void;
  onRegister?: () => void;
};

function Register({
  onLogin,
  onBackToLogin,
  onRegister,
}: RegisterProps) {
  const [language, setLanguage] =
    useState<"BM" | "EN">("EN");

  const [currency, setCurrency] =
    useState<"MYR" | "USD">("MYR");

  const [fullName, setFullName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [acceptTerms, setAcceptTerms] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  /* =================================
     LANGUAGE
  ================================= */

  const toggleLanguage = () => {
    setLanguage((current) =>
      current === "EN"
        ? "BM"
        : "EN"
    );
  };

  /* =================================
     CURRENCY
  ================================= */

  const toggleCurrency = () => {
    setCurrency((current) =>
      current === "MYR"
        ? "USD"
        : "MYR"
    );
  };

  /* =================================
     BACK TO LOGIN
  ================================= */

  const handleGoLogin = () => {
    if (onLogin) {
      onLogin();
      return;
    }

    if (onBackToLogin) {
      onBackToLogin();
      return;
    }

    if (onRegister) {
      onRegister();
      return;
    }

    window.history.back();
  };

  /* =================================
     REGISTER
  ================================= */

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setMessage("");

    if (
      !fullName.trim() ||
      !email.trim() ||
      !phone.trim() ||
      !password ||
      !confirmPassword
    ) {
      setMessage(
        language === "BM"
          ? "Sila lengkapkan semua ruangan."
          : "Please complete all required fields.",
      );
      return;
    }

    if (password.length < 8) {
      setMessage(
        language === "BM"
          ? "Kata laluan mestilah sekurang-kurangnya 8 aksara."
          : "Password must be at least 8 characters.",
      );
      return;
    }

    if (password !== confirmPassword) {
      setMessage(
        language === "BM"
          ? "Kata laluan tidak sepadan."
          : "Passwords do not match.",
      );
      return;
    }

    if (!acceptTerms) {
      setMessage(
        language === "BM"
          ? "Sila bersetuju dengan Terma & Syarat dan Dasar Privasi."
          : "Please agree to the Terms & Conditions and Privacy Policy.",
      );
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            fullName: fullName.trim(),
            email: email.trim(),
            phone: phone.trim(),
            password,
            terms: acceptTerms,
          }),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        setMessage(
          result.message ||
            (language === "BM"
              ? "Pendaftaran gagal."
              : "Registration failed."),
        );
        return;
      }

      setMessage(
        language === "BM"
          ? "Pendaftaran berjaya. Anda akan kembali ke halaman log masuk."
          : "Registration successful. Returning to login.",
      );

      setFullName("");
      setEmail("");
      setPhone("");
      setPassword("");
      setConfirmPassword("");
      setAcceptTerms(false);

      setTimeout(() => {
        handleGoLogin();
      }, 900);
    } catch (error) {
      console.error("Registration request failed:", error);

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
    <main className="register-page">

      {/* =================================
          KL CITY BACKGROUND
          public/images/kl-city.png
      ================================= */}

      <div
        className="register-background"
        aria-hidden="true"
      />

      {/* =================================
          PAGE CONTENT
      ================================= */}

      <div className="register-content">

        {/* =================================
            HEADER
        ================================= */}

        <header className="register-header">

          <div className="register-brand">

            <div className="register-brand-mark">
              <span />
              <span />
              <span />
            </div>

            <div className="register-brand-copy">

              <h1>
                AQR Capital
              </h1>

              <p>
                Melabur Bijak. Masa Depan Lebih Terjamin.
              </p>

            </div>

          </div>

          <div className="register-top-controls">

            {/* Language */}

            <button
              type="button"
              className="register-control-button"
              onClick={toggleLanguage}
            >
              <span className="register-flag">
                🇲🇾
              </span>

              <span
                className={
                  language === "BM"
                    ? "register-active-control"
                    : ""
                }
              >
                BM
              </span>

              <span className="register-divider">
                |
              </span>

              <span
                className={
                  language === "EN"
                    ? "register-active-control"
                    : ""
                }
              >
                EN
              </span>

              <span className="register-chevron">
                ▾
              </span>
            </button>

            {/* Currency */}

            <button
              type="button"
              className="register-currency-button"
              onClick={toggleCurrency}
            >
              {currency}

              <span className="register-chevron">
                ▾
              </span>
            </button>

          </div>

        </header>

        {/* =================================
            MAIN
        ================================= */}

        <section className="register-layout">

          {/* =================================
              LEFT SIDE
          ================================= */}

          <div className="register-hero">

            <div className="register-trust-badge">

              <span>
                ♛
              </span>

              <span>
                Platform Pelaburan Global
              </span>

              <i>
                •
              </i>

              <span>
                Dipercayai di Malaysia
              </span>

            </div>

            <div className="register-eyebrow">
              ✦{" "}
              {language === "BM"
                ? "Mulakan perjalanan pelaburan anda"
                : "Start your investment journey"}
            </div>

            <h2>
              {language === "BM"
                ? "Bina Masa Depan Anda Bersama"
                : "Build Your Future With"}

              <span>
                AQR Capital
              </span>
            </h2>

            <p className="register-hero-description">
              {language === "BM"
                ? "Satu akaun untuk mengurus pelaburan, memantau pasaran dan membina portfolio anda."
                : "One account to manage investments, monitor markets and build your portfolio."}
            </p>

            {/* =================================
                FEATURES
            ================================= */}

            <div className="register-feature-list">

              <RegisterFeature
                number="01"
                title={
                  language === "BM"
                    ? "Akses Pelbagai Pasaran"
                    : "Multi-Market Access"
                }
                description={
                  language === "BM"
                    ? "Akses saham, indeks dan aset global daripada satu platform."
                    : "Access stocks, indices and global assets from one platform."
                }
                icon="▥"
              />

              <RegisterFeature
                number="02"
                title={
                  language === "BM"
                    ? "Keselamatan Berlapis"
                    : "Layered Security"
                }
                description={
                  language === "BM"
                    ? "Akaun anda dilindungi dengan kawalan keselamatan moden."
                    : "Your account is protected with modern security controls."
                }
                icon="◇"
              />

              <RegisterFeature
                number="03"
                title={
                  language === "BM"
                    ? "Portfolio Dalam Satu Tempat"
                    : "Portfolio In One Place"
                }
                description={
                  language === "BM"
                    ? "Pantau nilai, prestasi dan pegangan anda dengan mudah."
                    : "Track value, performance and holdings with ease."
                }
                icon="◎"
              />

            </div>

            {/* =================================
                SECURITY FOOTER
            ================================= */}

            <div className="register-security-line">

              <span>
                ♙
              </span>

              <span>
                {language === "BM"
                  ? "Sambungan selamat"
                  : "Secure connection"}
              </span>

              <i>
                |
              </i>

              <span>
                2FA
              </span>

              <i>
                |
              </i>

              <span>
                {language === "BM"
                  ? "Standard keselamatan moden"
                  : "Modern security standards"}
              </span>

            </div>

          </div>

          {/* =================================
              REGISTER PANEL
          ================================= */}

          <div className="register-panel">

            <div className="register-panel-inner">

              {/* Header */}

              <div className="register-panel-title">

                <h2>
                  {language === "BM"
                    ? "Daftar Akaun"
                    : "Create Account"}
                </h2>

                <p>
                  {language === "BM"
                    ? "Cipta akaun AQR Capital anda untuk bermula."
                    : "Create your AQR Capital account to get started."}
                </p>

              </div>

              {/* =================================
                  FORM
              ================================= */}

              <form
                className="register-form"
                onSubmit={handleSubmit}
              >

                {/* Full Name */}

                <label htmlFor="register-full-name">
                  {language === "BM"
                    ? "Nama Penuh"
                    : "Full Name"}
                </label>

                <div className="register-input-wrapper">

                  <span className="register-input-icon">
                    ◉
                  </span>

                  <input
                    id="register-full-name"
                    type="text"
                    value={fullName}
                    onChange={(event) =>
                      setFullName(
                        event.target.value
                      )
                    }
                    placeholder={
                      language === "BM"
                        ? "Nama penuh anda"
                        : "Your full name"
                    }
                    autoComplete="name"
                  />

                </div>

                {/* Email */}

                <label htmlFor="register-email">
                  {language === "BM"
                    ? "E-mel"
                    : "Email"}
                </label>

                <div className="register-input-wrapper">

                  <span className="register-input-icon">
                    ✉
                  </span>

                  <input
                    id="register-email"
                    type="email"
                    value={email}
                    onChange={(event) =>
                      setEmail(
                        event.target.value
                      )
                    }
                    placeholder="nama@email.com"
                    autoComplete="email"
                  />

                </div>

                {/* Phone */}

                <label htmlFor="register-phone">
                  {language === "BM"
                    ? "Nombor Telefon"
                    : "Phone Number"}
                </label>

                <div className="register-input-wrapper">

                  <span className="register-input-icon">
                    ☎
                  </span>

                  <input
                    id="register-phone"
                    type="tel"
                    value={phone}
                    onChange={(event) =>
                      setPhone(
                        event.target.value
                      )
                    }
                    placeholder={
                      language === "BM"
                        ? "+60 12 345 6789"
                        : "+60 12 345 6789"
                    }
                    autoComplete="tel"
                  />

                </div>

                {/* Password */}

                <label htmlFor="register-password">
                  {language === "BM"
                    ? "Kata Laluan"
                    : "Password"}
                </label>

                <div className="register-input-wrapper">

                  <span className="register-input-icon">
                    ♧
                  </span>

                  <input
                    id="register-password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={password}
                    onChange={(event) =>
                      setPassword(
                        event.target.value
                      )
                    }
                    placeholder={
                      language === "BM"
                        ? "Minimum 8 aksara"
                        : "Minimum 8 characters"
                    }
                    autoComplete="new-password"
                  />

                  <button
                    type="button"
                    className="register-password-button"
                    onClick={() =>
                      setShowPassword(
                        (current) =>
                          !current
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

                {/* Confirm Password */}

                <label htmlFor="register-confirm-password">
                  {language === "BM"
                    ? "Sahkan Kata Laluan"
                    : "Confirm Password"}
                </label>

                <div className="register-input-wrapper">

                  <span className="register-input-icon">
                    ♧
                  </span>

                  <input
                    id="register-confirm-password"
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    value={confirmPassword}
                    onChange={(event) =>
                      setConfirmPassword(
                        event.target.value
                      )
                    }
                    placeholder={
                      language === "BM"
                        ? "Ulang kata laluan anda"
                        : "Repeat your password"
                    }
                    autoComplete="new-password"
                  />

                  <button
                    type="button"
                    className="register-password-button"
                    onClick={() =>
                      setShowConfirmPassword(
                        (current) =>
                          !current
                      )
                    }
                    aria-label={
                      showConfirmPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showConfirmPassword
                      ? "◉"
                      : "◌"}
                  </button>

                </div>

                {/* Terms */}

                <label className="register-terms">

                  <input
                    type="checkbox"
                    checked={acceptTerms}
                    onChange={(event) =>
                      setAcceptTerms(
                        event.target.checked
                      )
                    }
                  />

                  <span className="register-checkbox">
                    {acceptTerms
                      ? "✓"
                      : ""}
                  </span>

                  <span className="register-terms-text">

                    {language === "BM"
                      ? "Saya bersetuju dengan"
                      : "I agree to the"}

                    {" "}

                    <button
                      type="button"
                      className="register-link-button"
                    >
                      {language === "BM"
                        ? "Terma & Syarat"
                        : "Terms & Conditions"}
                    </button>

                    {" "}

                    {language === "BM"
                      ? "dan"
                      : "and"}

                    {" "}

                    <button
                      type="button"
                      className="register-link-button"
                    >
                      {language === "BM"
                        ? "Dasar Privasi"
                        : "Privacy Policy"}
                    </button>

                  </span>

                </label>

                {/* Message */}

                {message && (
                  <div className="register-message">
                    {message}
                  </div>
                )}

                {/* Create Account */}

                <button
                  type="submit"
                  className="create-account-button"
                  disabled={loading}
                >
                  {loading
                    ? language === "BM"
                      ? "Memproses..."
                      : "Creating..."
                    : language === "BM"
                      ? "Daftar Akaun"
                      : "Create Account"}

                  <span>
                    →
                  </span>
                </button>

                {/* Login */}

                <div className="register-login-row">

                  <span>
                    {language === "BM"
                      ? "Sudah mempunyai akaun?"
                      : "Already have an account?"}
                  </span>

                  <button
                    type="button"
                    className="register-login-button"
                    onClick={handleGoLogin}
                  >
                    {language === "BM"
                      ? "Log Masuk"
                      : "Log In"}

                    <span>
                      →
                    </span>
                  </button>

                </div>

              </form>

            </div>

          </div>

        </section>

      </div>

    </main>
  );
}

/* =================================
   FEATURE
================================= */

function RegisterFeature({
  number,
  title,
  description,
  icon,
}: {
  number: string;
  title: string;
  description: string;
  icon: string;
}) {
  return (
    <div className="register-feature">

      <div className="register-feature-number">
        {number}
      </div>

      <div className="register-feature-icon">
        {icon}
      </div>

      <div className="register-feature-copy">

        <h3>
          {title}
        </h3>

        <p>
          {description}
        </p>

      </div>

    </div>
  );
}

export default Register;