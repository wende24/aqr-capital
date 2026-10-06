import { useEffect, useRef, useState } from "react";



import "./App.css";



import Login from "./pages/Login";



import Register from "./pages/Register";



import Home from "./pages/Home";

const API_BASE_URL =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
    ? "http://localhost:4000"
    : "";



type Page =



  | "home"



  | "login"



  | "register"



  | "dashboard";



const stock = {



  symbol: "AAPL",



  code: "0097",



  tradingViewSymbol: "NASDAQ:AAPL",



};



type ProfileData = {

  user: {

    id: string;

    fullName: string;

    email: string;

    phone: string | null;

    createdAt: string;

  };

  account: {

    id: string;

    accountType: string;

    cashBalance: string;

    totalValue: string;

  } | null;

};



type PortfolioHolding = {

  id: string;

  symbol: string;

  quantity: number;

  avgPrice: number;

  currentPrice: number;

  marketValue: number;

  profitLoss: number;

};



type PortfolioData = {

  capital: number;

  cashBalance: number;

  investment: number;

  totalValue: number;

  earning: number;

  holdings: PortfolioHolding[];

};



function formatRM(value: number) {

  return `RM${value.toLocaleString("en-MY", {

    minimumFractionDigits: 2,

    maximumFractionDigits: 2,

  })}`;

}



function formatPercent(value: number) {

  const absolute = Math.abs(value);

  const prefix = value >= 0 ? "+" : "-";

  return `${prefix}${absolute.toFixed(2)}%`;

}



function TradingViewChart({



  symbol,



}: {



  symbol: string;



}) {



  const containerRef =



    useRef<HTMLDivElement>(null);



  useEffect(() => {



    const container =



      containerRef.current;



    if (!container) {



      return;



    }



    container.innerHTML = "";



    const widgetContainer =



      document.createElement("div");



    widgetContainer.className =



      "tradingview-widget-container";



    widgetContainer.style.width = "100%";



    widgetContainer.style.height = "100%";



    const widget =



      document.createElement("div");



    widget.className =



      "tradingview-widget-container__widget";



    widget.style.width = "100%";



    widget.style.height = "100%";



    const script =



      document.createElement("script");



    script.type = "text/javascript";



    script.src =



      "https://s3.tradingview\.com/external-embedding/embed-widget-advanced-chart.js";



    script.async = true;



    script.innerHTML = JSON.stringify({



      autosize: true,



      symbol,



      interval: "60",



      timezone: "Asia/Kuala_Lumpur",



      theme: "dark",



      style: "1",



      locale: "en",



      allow_symbol_change: true,



      hide_side_toolbar: false,



      hide_top_toolbar: false,



      hide_legend: false,



      hide_volume: false,



      calendar: false,



      details: false,



      hotlist: false,



      save_image: false,



      withdateranges: true,



      backgroundColor:



        "#07111f",



      gridColor:



        "rgba(35, 62, 88, 0.30)",



      support_host:



        "https://www\.tradingview\.com",



      studies: [],



    });



    widgetContainer.appendChild(



      widget



    );



    widgetContainer.appendChild(



      script



    );



    container.appendChild(



      widgetContainer



    );



    return () => {



      container.innerHTML = "";



    };



  }, [symbol]);



  return (



    <div



      ref={containerRef}



      className="tradingview-container"



    />



  );



}



function HoldingLogo({



  type,



}: {



  type: string;



}) {



  if (type === "apple") {



    return (



      <div className="holding-logo apple-logo">



        <span>●</span>



      </div>



    );



  }



  if (type === "tesla") {



    return (



      <div className="holding-logo tesla-logo">



        T



      </div>



    );



  }



  if (type === "nvda") {



    return (



      <div className="holding-logo nvda-logo">



        N



      </div>



    );



  }



  return (



    <div className="holding-logo google-logo">



      G



    </div>



  );



}



function InvestmentPanel({

  holdings,

  investment,

  earning,

}: {

  holdings: PortfolioHolding[];

  investment: number;

  earning: number;

}) {

  return (

    <section className="investment-panel">

      <div className="investment-header">

        <div className="investment-title-group">

          <div className="investment-icon">

            <svg

              viewBox="0 0 24 24"

              fill="none"

              stroke="currentColor"

              strokeWidth="2"

            >

              <ellipse

                cx="9"

                cy="7"

                rx="5"

                ry="2.5"

              />

              <path d="M4 7v5c0 1.4 2.2 2.5 5 2.5s5-1.1 5-2.5V7" />

              <path d="M14 9.5c3.3 0 6 1.1 6 3v4c0 1.7-2.7 3-6 3s-6-1.3-6-3" />

              <path d="M14 14.5c3.3 0 6-1.1 6-3" />

            </svg>

          </div>

          <div>

            <h2>Investment</h2>

            <p>Current position value and allocation</p>

          </div>

        </div>



        <div className="investment-total">

          <strong>{formatRM(investment)}</strong>

          <div>

            <span

              className={

                earning >= 0

                  ? "positive"

                  : "change negative"

              }

            >

              {earning >= 0 ? "▲" : "▼"}{" "}

              {formatPercent(

                investment > 0

                  ? (earning / investment) * 100

                  : 0,

              )}

            </span>

            <span className="today">Current</span>

          </div>

        </div>

      </div>



      <div className="investment-body">

        <div className="donut-wrapper">

          <div className="investment-donut">

            <div className="donut-inner">

              <strong>{formatRM(investment)}</strong>

              <span>Investment</span>

            </div>

          </div>

        </div>



        <div className="holdings-table">

          <div className="table-header">

            <div>#</div>

            <div>Symbol</div>

            <div>Allocation</div>

            <div>Value</div>

            <div>P/L</div>

          </div>



          {holdings.length === 0 ? (

            <div className="holding-row">

              <div className="rank">—</div>

              <div className="symbol-cell">

                <strong>No holdings</strong>

              </div>

              <div className="allocation">0%</div>

              <div className="value">{formatRM(0)}</div>

              <div className="change">—</div>

            </div>

          ) : (

            holdings.map((holding, index) => {

              const allocation =

                investment > 0

                  ? (holding.marketValue / investment) * 100

                  : 0;



              const cost =

                holding.quantity * holding.avgPrice;



              const pnlPercent =

                cost > 0

                  ? (holding.profitLoss / cost) * 100

                  : 0;



              const type =

                holding.symbol === "AAPL"

                  ? "apple"

                  : holding.symbol === "NVDA"

                    ? "nvda"

                    : holding.symbol === "TSLA"

                      ? "tesla"

                      : "google";



              return (

                <div

                  className="holding-row"

                  key={holding.id}

                >

                  <div className="rank">{index + 1}</div>



                  <div className="symbol-cell">

                    <HoldingLogo type={type} />

                    <strong>{holding.symbol}</strong>

                  </div>



                  <div className="allocation">

                    {formatPercent(allocation)}

                  </div>



                  <div className="value">

                    {formatRM(holding.marketValue)}

                  </div>



                  <div

                    className={

                      holding.profitLoss < 0

                        ? "change negative"

                        : "change"

                    }

                  >

                    {holding.profitLoss >= 0 ? "▲" : "▼"}{" "}

                    {formatPercent(pnlPercent)}

                  </div>

                </div>

              );

            })

          )}

        </div>

      </div>

    </section>

  );

}



function Dashboard({

  onLogout,

}: {

  onLogout: () => void;

}) {

  const [profile, setProfile] =

    useState<ProfileData | null>(null);



  const [portfolio, setPortfolio] =

    useState<PortfolioData | null>(null);



  const [loading, setLoading] =

    useState(true);



  const [error, setError] =

    useState("");



  useEffect(() => {

    const token =

      localStorage.getItem("aqr_token");



    if (!token) {

      setError("Authentication required.");

      setLoading(false);

      return;

    }



    const headers = {

      Authorization: `Bearer ${token}`,

      Accept: "application/json",

    };



    Promise.all([

      fetch(

        `${API_BASE_URL}/api/auth/me`,

        {

          method: "GET",

          headers,

        },

      ),

      fetch(

        `${API_BASE_URL}/api/portfolio/me`,

        {

          method: "GET",

          headers,

        },

      ),

    ])

      .then(async ([profileResponse, portfolioResponse]) => {

        const profileResult =

          await profileResponse.json();



        const portfolioResult =

          await portfolioResponse.json();



        if (

          !profileResponse.ok ||

          !profileResult.success

        ) {

          throw new Error(

            profileResult.message ||

              "Unable to load user profile.",

          );

        }



        if (

          !portfolioResponse.ok ||

          !portfolioResult.success

        ) {

          throw new Error(

            portfolioResult.message ||

              "Unable to load portfolio.",

          );

        }



        return {

          profile: profileResult.data,

          portfolio: portfolioResult.data,

        };

      })

      .then(({ profile: nextProfile, portfolio: nextPortfolio }) => {

        setProfile(nextProfile);

        setPortfolio(nextPortfolio);

      })

      .catch((fetchError) => {

        console.error(

          "Failed to load dashboard data:",

          fetchError,

        );



        setError(

          fetchError instanceof Error

            ? fetchError.message

            : "Unable to load dashboard data.",

        );

      })

      .finally(() => {

        setLoading(false);

      });

  }, []);



  const capital =

    portfolio?.capital ?? 0;



  const investment =

    portfolio?.investment ?? 0;



  const earning =

    portfolio?.earning ?? 0;



  const holdingsData =

    portfolio?.holdings ?? [];



  const accountValue =

    portfolio?.totalValue ?? 0;



  return (

    <div className="dashboard">
      <button
        type="button"
        onClick={onLogout}
        style={{
          position: "fixed",
          top: "18px",
          right: "18px",
          zIndex: 9999,
          padding: "10px 18px",
          border: "1px solid rgba(255,255,255,0.15)",
          borderRadius: "10px",
          background: "#111c2b",
          color: "#ffffff",
          cursor: "pointer",
          fontSize: "14px",
          fontWeight: 600,
        }}
      >
        Logout
      </button>

      <section className="summary-grid">

        <div className="summary-card capital-card">

          <div className="card-top">

            <div className="card-icon blue-icon">

              <svg

                viewBox="0 0 24 24"

                fill="none"

                stroke="currentColor"

                strokeWidth="2"

              >

                <rect

                  x="3"

                  y="5"

                  width="18"

                  height="14"

                  rx="2"

                />

                <path d="M3 8h18" />

                <circle

                  cx="17"

                  cy="13"

                  r="2"

                />

              </svg>

            </div>



            <div>

              <h3>Capital</h3>

              <p>Total account capital</p>

            </div>

          </div>



          <div className="summary-value">

            {loading

              ? "Loading..."

              : formatRM(capital)}

          </div>



          <div className="summary-change">

            <span className="positive">

              ● Managed

            </span>

            <span className="today">

              AQR Capital

            </span>

          </div>



          <div className="mini-chart blue-chart" />

        </div>



        <div className="summary-card investment-card">

          <div className="card-top">

            <div className="card-icon purple-icon">

              <svg

                viewBox="0 0 24 24"

                fill="none"

                stroke="currentColor"

                strokeWidth="2"

              >

                <ellipse

                  cx="9"

                  cy="7"

                  rx="5"

                  ry="2.5"

                />

                <path d="M4 7v5c0 1.4 2.2 2.5 5 2.5s5-1.1 5-2.5V7" />

                <path d="M14 9.5c3.3 0 6 1.1 6 3v4c0 1.7-2.7 3-6 3s-6-1.3-6-3" />

              </svg>

            </div>



            <div>

              <h3>Investment</h3>

              <p>Current position value</p>

            </div>

          </div>



          <div className="summary-value">

            {loading

              ? "Loading..."

              : formatRM(investment)}

          </div>



          <div className="summary-change">

            <span className="positive">

              {holdingsData.length} Holdings

            </span>

            <span className="today">

              Current value

            </span>

          </div>



          <div className="mini-chart purple-chart" />

        </div>



        <div className="summary-card earning-card">

          <div className="card-top">

            <div className="card-icon green-icon">

              <svg

                viewBox="0 0 24 24"

                fill="none"

                stroke="currentColor"

                strokeWidth="2"

              >

                <path d="M4 20V12" />

                <path d="M10 20V8" />

                <path d="M16 20V4" />

                <path d="M22 20H2" />

              </svg>

            </div>



            <div>

              <h3>Earning</h3>

              <p>Total profit &amp; loss</p>

            </div>

          </div>



          <div className="summary-value">

            {loading

              ? "Loading..."

              : formatRM(earning)}

          </div>



          <div className="summary-change">

            <span

              className={

                earning >= 0

                  ? "positive"

                  : "change negative"

              }

            >

              {earning >= 0 ? "▲" : "▼"}{" "}

              {formatPercent(

                capital > 0

                  ? (earning / capital) * 100

                  : 0,

              )}

            </span>



            <span className="today">

              Total return

            </span>

          </div>



          <div className="mini-chart green-chart" />

        </div>



        <div className="summary-card account-card">

          <div className="account-header">

            <div className="card-top">

              <div className="card-icon orange-icon">

                <svg

                  viewBox="0 0 24 24"

                  fill="none"

                  stroke="currentColor"

                  strokeWidth="2"

                >

                  <circle

                    cx="12"

                    cy="8"

                    r="3"

                  />

                  <path d="M5 21c0-4 3-6 7-6s7 2 7 6" />

                </svg>

              </div>



              <div>

                <h3>Account Status</h3>

              </div>

            </div>



            <div className="active-pill">

              <span />

              Active

            </div>

          </div>



          <div className="account-info">

            <div>

              <span>Username</span>

              <strong>

                {profile?.user.fullName ??

                  "Loading..."}

              </strong>

            </div>



            <div>

              <span>Account ID</span>

              <strong>

                {profile?.account?.id

                  ? `#${profile.account.id.slice(0, 8)}`

                  : "Loading..."}

              </strong>

            </div>



            <div>

              <span>Account Type</span>

              <strong>

                {profile?.account?.accountType ===

                "cash"

                  ? "Cash"

                  : profile?.account?.accountType ??

                    "managed"}

              </strong>

            </div>



            <div>

              <span>Status</span>

              <strong className="green-text">

                Active

              </strong>

            </div>

          </div>

        </div>

      </section>



      {error && (

        <div

          className="login-message"

          style={{ marginBottom: "12px" }}

        >

          {error}

        </div>

      )}



      <section className="chart-card">

        <TradingViewChart

          symbol={stock.tradingViewSymbol}

        />

      </section>



      <InvestmentPanel

        holdings={holdingsData}

        investment={investment}

        earning={earning}

      />



      <div className="dashboard-total-value">

        Total Portfolio Value:{" "}

        <strong>{formatRM(accountValue)}</strong>

      </div>

    </div>

  );

}



function App() {
  const [page, setPage] = useState<Page>(() => {
    const token = localStorage.getItem("aqr_token");

    return token ? "dashboard" : "home";
  });

  const handleLogout = () => {
    localStorage.removeItem("aqr_token");
    localStorage.removeItem("aqr_user");
    setPage("login");
  };

  useEffect(() => {
    const token = localStorage.getItem("aqr_token");

    if (!token) {
      if (page === "dashboard") {
        setPage("login");
      }
      return;
    }

    if (page !== "dashboard") {
      return;
    }

    fetch(`${API_BASE_URL}/api/auth/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    })
      .then(async (response) => {
        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.message || "Authentication expired",
          );
        }

        return result;
      })
      .catch(() => {
        localStorage.removeItem("aqr_token");
        localStorage.removeItem("aqr_user");
        setPage("login");
      });
  }, [page]);

  if (page === "home") {
    return (
      <Home
        onLogin={() => setPage("login")}
        onRegister={() => setPage("register")}
      />
    );
  }

  if (page === "register") {
    return (
      <Register
        onLogin={() => setPage("login")}
      />
    );
  }

  if (page === "dashboard") {
    const token = localStorage.getItem("aqr_token");

    if (!token) {
      return null;
    }

    return (
      <Dashboard
        onLogout={handleLogout}
      />
    );
  }

  return (
    <Login
      onRegister={() => setPage("register")}
      onLoginSuccess={() => setPage("dashboard")}
    />
  );
}

export default App;


