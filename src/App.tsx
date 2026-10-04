import { useEffect, useRef, useState } from "react";

import "./App.css";



import Login from "./pages/Login";

import Register from "./pages/Register";
import Home from "./pages/Home";



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



const holdings = [

  {

    rank: 1,

    symbol: "AAPL",

    allocation: "35.4%",

    value: "RM2,240.00",

    change: "+1.32%",

    type: "apple",

  },

  {

    rank: 2,

    symbol: "TSLA",

    allocation: "28.1%",

    value: "RM1,780.00",

    change: "+0.85%",

    type: "tesla",

  },

  {

    rank: 3,

    symbol: "NVDA",

    allocation: "18.6%",

    value: "RM1,175.00",

    change: "+2.14%",

    type: "nvda",

  },

  {

    rank: 4,

    symbol: "GOOGL",

    allocation: "17.9%",

    value: "RM1,125.00",

    change: "-0.62%",

    type: "google",

  },

];



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

      "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";



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

        "https://www.tradingview.com",



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



function InvestmentPanel() {

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

            <h2>

              Investment

            </h2>



            <p>

              Current position value and allocation

            </p>

          </div>

        </div>



        <div className="investment-total">

          <strong>

            RM6,320.00

          </strong>



          <div>

            <span className="positive">

              ▲ +1.28%

            </span>



            <span className="today">

              Today

            </span>

          </div>

        </div>

      </div>



      <div className="investment-body">

        <div className="donut-wrapper">

          <div className="investment-donut">

            <div className="donut-inner">

              <strong>

                RM6,320.00

              </strong>



              <span>

                Earning

              </span>

            </div>

          </div>

        </div>



        <div className="holdings-table">

          <div className="table-header">

            <div>#</div>

            <div>Symbol</div>

            <div>Allocation</div>

            <div>Value</div>

            <div>24h Change</div>

          </div>



          {holdings.map(

            (holding) => (

              <div

                className="holding-row"

                key={

                  holding.symbol

                }

              >

                <div className="rank">

                  {holding.rank}

                </div>



                <div className="symbol-cell">

                  <HoldingLogo

                    type={

                      holding.type

                    }

                  />



                  <strong>

                    {

                      holding.symbol

                    }

                  </strong>

                </div>



                <div className="allocation">

                  {

                    holding.allocation

                  }

                </div>



                <div className="value">

                  {

                    holding.value

                  }

                </div>



                <div

                  className={

                    holding.change.startsWith(

                      "-"

                    )

                      ? "change negative"

                      : "change"

                  }

                >

                  {

                    holding.change

                  }

                </div>

              </div>

            )

          )}

        </div>

      </div>

    </section>

  );

}



function Dashboard() {
  const [profile, setProfile] = useState<{
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
  } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("aqr_token");

    if (!token) {
      return;
    }

    fetch("http://localhost:4000/api/auth/me", {
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
            result.message || "Unable to load user profile.",
          );
        }

        return result;
      })
      .then((result) => {
        setProfile(result.data);
      })
      .catch((error) => {
        console.error("Failed to load current user:", error);
      });
  }, []);


  return (

    <div className="dashboard">

      {/* =================================

          TOP SUMMARY

      ================================= */}



      <section className="summary-grid">

        {/* Capital */}



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

              <h3>

                Capital

              </h3>



              <p>

                Total account capital

              </p>

            </div>

          </div>



          <div className="summary-value">

            RM10,000.00

          </div>



          <div className="summary-change">

            <span className="positive">

              ▲ +2.35%

            </span>



            <span className="today">

              Today

            </span>

          </div>



          <div className="mini-chart blue-chart" />

        </div>



        {/* Investment */}



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

              <h3>

                Investment

              </h3>



              <p>

                Current position value

              </p>

            </div>

          </div>



          <div className="summary-value">

            RM6,320.00

          </div>



          <div className="summary-change">

            <span className="positive">

              ▲ +1.28%

            </span>



            <span className="today">

              Today

            </span>

          </div>



          <div className="mini-chart purple-chart" />

        </div>



        {/* Earning */}



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

              <h3>

                Earning

              </h3>



              <p>

                Total profit &amp; loss

              </p>

            </div>

          </div>



          <div className="summary-value">

            RM1,245.60

          </div>



          <div className="summary-change">

            <span className="positive">

              ▲ +24.56%

            </span>



            <span className="today">

              Today

            </span>

          </div>



          <div className="mini-chart green-chart" />

        </div>



        {/* Account Status */}



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

                <h3>

                  Account Status

                </h3>

              </div>

            </div>



            <div className="active-pill">

              <span />

              Active

            </div>

          </div>



          <div className="account-info">

            <div>

              <span>

                Username

              </span>



              <strong>

                {profile?.user.fullName ?? "Loading..."}

              </strong>

            </div>



            <div>

              <span>

                Account ID

              </span>



              <strong>

                {profile?.account?.id
                  ? `#${profile.account.id.slice(0, 8)}`
                  : "Loading..."}

              </strong>

            </div>



            <div>

              <span>

                Account Type

              </span>



              <strong>

                {profile?.account?.accountType === "cash"
                  ? "Cash"
                  : profile?.account?.accountType ?? "Loading..."}

              </strong>

            </div>



            <div>

              <span>

                Status

              </span>



              <strong className="green-text">

                Active

              </strong>

            </div>

          </div>

        </div>

      </section>



      {/* =================================

          TRADINGVIEW

      ================================= */}



      <section className="chart-card">

        <TradingViewChart

          symbol={

            stock.tradingViewSymbol

          }

        />

      </section>



      {/* =================================

          INVESTMENT PANEL

      ================================= */}



      <InvestmentPanel />

    </div>

  );

}



/* =================================

   APP PAGE CONTROL

\================================= */



function App() {

  const [page, setPage] =

    useState<Page>("home");



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

        onLogin={() =>

          setPage("login")

        }

      />

    );

  }



  if (page === "dashboard") {

    return <Dashboard />;

  }



  return (
    <Login
      onRegister={() =>
        setPage("register")
      }
      onLoginSuccess={() =>
        setPage("dashboard")
      }
    />
  );

}



export default App;

