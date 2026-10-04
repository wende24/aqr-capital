import "./Home.css";

type HomeProps = {
  onLogin?: () => void;
  onRegister?: () => void;
};

type Market = {
  symbol: string;
  title: string;
  value: string;
  change: string;
  tone: "orange" | "purple" | "blue" | "red";
  negative?: boolean;
};

const markets: Market[] = [
  {
    symbol: "â‚¿",
    title: "BTC / MYR",
    value: "RM 298,432.10",
    change: "+2.35%",
    tone: "orange",
  },
  {
    symbol: "â—†",
    title: "ETH / MYR",
    value: "RM 12,845.30",
    change: "+1.28%",
    tone: "purple",
  },
  {
    symbol: "MY",
    title: "KLCI",
    value: "1,642.38",
    change: "+0.56%",
    tone: "blue",
  },
  {
    symbol: "US",
    title: "USD / MYR",
    value: "RM 4.7120",
    change: "-0.24%",
    tone: "red",
    negative: true,
  },
];

function Home({ onLogin, onRegister }: HomeProps) {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <main className="aqr-home">
      <div className="aqr-home__background" aria-hidden="true">
        <div className="aqr-home__city" />
        <div className="aqr-home__blue-glow" />
        <div className="aqr-home__diagonal" />
        <div className="aqr-home__bottom-glow" />
      </div>

      <header className="aqr-header">
        <button
          type="button"
          className="aqr-brand"
          onClick={() =>
            window.scrollTo({
              top: 0,
              behavior: "smooth",
            })
          }
          aria-label="AQR Capital"
        >
          <span className="aqr-brand__mark" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span className="aqr-brand__text">
            <strong>AQR Capital</strong>
            <small>Melabur Bijak. Masa Depan Lebih Terjamin.</small>
          </span>
        </button>

        <nav className="aqr-nav" aria-label="Primary">
          <button
            type="button"
            className="aqr-nav__item is-active"
            onClick={() =>
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              })
            }
          >
            Utama
          </button>

          <button
            type="button"
            className="aqr-nav__item"
            onClick={() => scrollTo("about")}
          >
            Tentang Kami
          </button>

          <button
            type="button"
            className="aqr-nav__item"
            onClick={() => scrollTo("markets")}
          >
            Pasaran
          </button>

          <button
            type="button"
            className="aqr-nav__item"
            onClick={() => scrollTo("platform")}
          >
            Platform
          </button>

          <button
            type="button"
            className="aqr-nav__item"
            onClick={() => scrollTo("education")}
          >
            Pendidikan
          </button>

          <button
            type="button"
            className="aqr-nav__item"
            onClick={() => scrollTo("support")}
          >
            Sokongan
          </button>
        </nav>

        <div className="aqr-header__actions">
          <button type="button" className="aqr-language">
            <span>ðŸŒ</span>
            BM
            <span>âŒ„</span>
          </button>

          <button
            type="button"
            className="aqr-button aqr-button--ghost"
            onClick={onLogin}
          >
            Log Masuk
          </button>

          <button
            type="button"
            className="aqr-button aqr-button--primary"
            onClick={onRegister}
          >
            Daftar
          </button>
        </div>
      </header>

      <section id="about" className="aqr-hero">
        <div className="aqr-hero__content">
          <div className="aqr-badge">
            <span>ðŸ‡²ðŸ‡¾</span>
            <span>Platform Pelaburan Global</span>
            <b>â€¢</b>
            <span>Dipercayai di Malaysia</span>
          </div>

          <p className="aqr-hero__kicker">
            âœ¦ Start your investment journey
          </p>

          <h1 className="aqr-hero__title">
            Melabur Dengan Bijak
            <br />
            Bersama <span>AQR Capital</span>
          </h1>

          <p className="aqr-hero__description">
            Akses pasaran global seperti saham, kripto, forex dan lebih banyak
            lagi. Peluang lebih luas, masa depan lebih terjamin.
          </p>

          <div className="aqr-hero__buttons">
            <button
              type="button"
              className="aqr-button aqr-button--primary aqr-button--large"
              onClick={onRegister}
            >
              Mulakan Sekarang
              <span>â†’</span>
            </button>

            <button
              type="button"
              className="aqr-button aqr-button--ghost aqr-button--large"
              onClick={() => scrollTo("platform")}
            >
              Ketahui Lebih Lanjut
            </button>
          </div>

          <div className="aqr-trust-row">
            <TrustItem icon="â—‡" text="Selamat & Dipercayai" />
            <TrustItem icon="â—ˆ" text="Yuran Kompetitif" />
            <TrustItem icon="âœ¥" text="Sokongan Tempatan" />
          </div>
        </div>

        <div className="aqr-hero__visual">
          <div className="aqr-user-card">
            <div className="aqr-user-card__icon">â™™</div>
            <div>
              <strong>500,000+</strong>
              <span>Pengguna di seluruh dunia</span>
            </div>
          </div>
        </div>
      </section>

      <section className="aqr-market-section">
        <div className="aqr-market-grid">
          {markets.map((market) => (
            <button
              key={market.title}
              type="button"
              className={`aqr-market-card aqr-market-card--${market.tone}`}
              onClick={() => scrollTo("markets")}
            >
              <div className="aqr-market-card__top">
                <span className="aqr-market-card__icon">
                  {market.symbol}
                </span>
                <span>{market.title}</span>
              </div>

              <strong>{market.value}</strong>

              <span
                className={`aqr-market-card__change${
                  market.negative ? " negative" : ""
                }`}
              >
                {market.negative ? "â–¼" : "â–²"} {market.change}
              </span>

              <span className="aqr-sparkline" aria-hidden="true">
                <i />
                <i />
                <i />
                <i />
                <i />
                <i />
              </span>
            </button>
          ))}
        </div>
      </section>

      <section id="platform" className="aqr-platform">
        <div className="aqr-platform__copy">
          <span className="aqr-eyebrow">PLATFORM BERPRESTASI TINGGI</span>

          <h2>
            Dagangan Lebih Pantas,
            <br />
            Lebih Pintar, <span>Lebih Mudah</span>
          </h2>

          <p>
            AQR Capital menyediakan platform dagangan moden dengan data masa
            nyata, alat analisis profesional dan pengalaman yang mesra
            pengguna.
          </p>

          <ul className="aqr-checks">
            <li>Data pasaran masa nyata</li>
            <li>Carta interaktif &amp; alat analisis</li>
            <li>Akses di pelbagai peranti</li>
            <li>Sesuai untuk pemula dan profesional</li>
          </ul>

          <button
            type="button"
            className="aqr-button aqr-button--primary aqr-button--large"
            onClick={() => scrollTo("markets")}
          >
            Terokai Platform
            <span>â†’</span>
          </button>
        </div>

        <div className="aqr-platform__visual">
          <div className="aqr-platform__glow" />

          <div className="aqr-laptop">
            <div className="aqr-laptop__screen">
              <div className="mini-topbar">
                <span className="mini-logo">A</span>
                <strong>AQR Capital</strong>
                <span className="mini-active">Active</span>
              </div>

              <div className="mini-metrics">
                <MiniMetric
                  title="Capital"
                  value="RM 10,000.00"
                  tone="blue"
                />
                <MiniMetric
                  title="Investment"
                  value="RM 6,320.00"
                  tone="purple"
                />
                <MiniMetric
                  title="Earning"
                  value="RM 1,245.60"
                  tone="green"
                />
              </div>

              <div className="mini-chart">
                <div className="mini-chart__grid" />
                <div className="mini-chart__line" />
                <div className="mini-chart__bars">
                  <i />
                  <i />
                  <i />
                  <i />
                  <i />
                  <i />
                  <i />
                  <i />
                  <i />
                  <i />
                  <i />
                  <i />
                </div>
              </div>
            </div>

            <div className="aqr-laptop__base" />
          </div>

          <div className="aqr-phone">
            <div className="aqr-phone__notch" />

            <div className="aqr-phone__head">
              <strong>AQR Capital</strong>
              <span>âŒ•</span>
            </div>

            <div className="aqr-phone__portfolio">
              <small>Portfolio</small>
              <strong>RM 10,000.00</strong>
              <span>â–² +2.35%</span>
            </div>

            {markets.map((market) => (
              <div className="aqr-phone__asset" key={market.title}>
                <span className={`phone-dot phone-dot--${market.tone}`}>
                  {market.symbol}
                </span>
                <small>{market.title}</small>
                <b className={market.negative ? "negative" : ""}>
                  {market.change}
                </b>
              </div>
            ))}

            <div className="aqr-phone__nav">
              <span>âŒ‚</span>
              <span>â–¥</span>
              <span>ï¼‹</span>
              <span>â—Œ</span>
              <span>â—Ž</span>
            </div>
          </div>
        </div>
      </section>

      <section id="markets" className="aqr-investments">
        <div className="aqr-section-title">
          <span className="aqr-eyebrow">
            PELBAGAI PASARAN DI SATU PLATFORM
          </span>

          <h2>
            Peluang Pelaburan <span>Tanpa Sempadan</span>
          </h2>

          <p>
            Berdagang dan melabur dalam pelbagai aset global dengan satu akaun
            AQR Capital.
          </p>
        </div>

        <div className="aqr-investment-grid">
          <InvestmentCard
            tone="orange"
            icon="â‚¿"
            title="Mata Wang Kripto"
            description="Akses kepada Bitcoin, Ethereum dan lebih 100 mata wang kripto."
          />

          <InvestmentCard
            tone="blue"
            icon="â–¥"
            title="Saham Global"
            description="Melabur dalam syarikat terkemuka dunia seperti Apple, Tesla, NVIDIA."
          />

          <InvestmentCard
            tone="green"
            icon="â—‰"
            title="Forex"
            description="Dagang lebih 50 pasangan mata wang dengan spread kompetitif."
          />

          <InvestmentCard
            tone="purple"
            icon="â–¥"
            title="Indeks & Komoditi"
            description="Peluang dalam emas, minyak, indeks global dan banyak lagi."
          />
        </div>
      </section>

      <section id="education" className="aqr-steps-section">
        <div className="aqr-steps-content">
          <span className="aqr-eyebrow">
            CARA BERJALAN DENGAN AQR CAPITAL
          </span>

          <h2>
            Mula Melabur Dalam <span>3 Langkah Mudah</span>
          </h2>

          <div className="aqr-step-grid">
            <StepCard
              number="1"
              icon="â™™"
              title="Daftar Akaun"
              description="Buka akaun dalam beberapa minit dengan proses yang mudah."
            />

            <StepCard
              number="2"
              icon="â–£"
              title="Deposit Dana"
              description="Pilih kaedah pembayaran yang selamat dan mudah di Malaysia."
            />

            <StepCard
              number="3"
              icon="â–¥"
              title="Mula Berdagang"
              description="Akses pasaran global dan mula merebut peluang."
            />
          </div>
        </div>

        <div className="aqr-security">
          <div className="aqr-security__icon">â—ˆ</div>

          <div>
            <h3>
              Pelaburan Lebih Selamat
              <br />
              Dengan AQR Capital
            </h3>

            <ul>
              <li>Dikawal selia &amp; mematuhi standard</li>
              <li>Perlindungan data berlapis</li>
              <li>Dana pelanggan diasingkan</li>
              <li>Sokongan tempatan dalam Bahasa Melayu</li>
            </ul>
          </div>
        </div>
      </section>

      <section id="support" className="aqr-support">
        <div>
          <span className="aqr-eyebrow">SOKONGAN</span>

          <h2>
            Sentiasa Bersedia <span>Membantu Anda</span>
          </h2>

          <p>
            Pasukan sokongan AQR Capital sentiasa bersedia membantu anda dalam
            perjalanan pelaburan.
          </p>
        </div>

        <button
          type="button"
          className="aqr-button aqr-button--primary"
        >
          Hubungi Kami
          <span>â†’</span>
        </button>
      </section>

      <footer className="aqr-footer">
        <div className="aqr-footer__grid">
          <div className="aqr-footer__brand">
            <div className="aqr-brand aqr-brand--footer">
              <span className="aqr-brand__mark" aria-hidden="true">
                <i />
                <i />
                <i />
              </span>

              <span className="aqr-brand__text">
                <strong>AQR Capital</strong>
              </span>
            </div>

            <p>
              Melabur dengan bijak. Masa depan lebih terjamin bersama AQR
              Capital.
            </p>

            <div className="aqr-socials">
              <button type="button">f</button>
              <button type="button">â—Ž</button>
              <button type="button">â–¶</button>
              <button type="button">X</button>
              <button type="button">in</button>
            </div>
          </div>

          <FooterColumn
            title="Pautan Pantas"
            items={[
              "Utama",
              "Tentang Kami",
              "Pasaran",
              "Platform",
              "Pendidikan",
            ]}
          />

          <FooterColumn
            title="Sokongan"
            items={[
              "Pusat Bantuan",
              "Hubungi Kami",
              "Soalan Lazim",
              "Terma & Syarat",
              "Dasar Privasi",
            ]}
          />

          <div className="aqr-footer__column">
            <h4>Hubungi Kami</h4>
            <span>â—‰ Kuala Lumpur, Malaysia</span>
            <span>âœ‰ support@aqrcapital.com</span>
            <span>â˜Ž +60 3-1234 5678</span>
            <span>â—· Isnin - Jum 9:00 pagi - 6:00 petang</span>
          </div>

          <div className="aqr-footer__column">
            <h4>Dapatkan Berita Terkini</h4>
            <span>
              Langgan untuk kemas kini pasaran dan promosi terkini.
            </span>

            <div className="aqr-newsletter">
              <input
                type="email"
                placeholder="Alamat e-mel anda"
              />
              <button type="button">â†’</button>
            </div>
          </div>
        </div>

        <div className="aqr-footer__bottom">
          <span>
            Â© 2024 AQR Capital. Hak Cipta Terpelihara.
          </span>

          <span>
            Terma &amp; Syaratã€€|ã€€Dasar Privasiã€€|ã€€Penafian
          </span>
        </div>
      </footer>
    </main>
  );
}

function TrustItem({
  icon,
  text,
}: {
  icon: string;
  text: string;
}) {
  return (
    <div className="aqr-trust">
      <span>{icon}</span>
      <small>{text}</small>
    </div>
  );
}

function MiniMetric({
  title,
  value,
  tone,
}: {
  title: string;
  value: string;
  tone: "blue" | "purple" | "green";
}) {
  return (
    <div className={`mini-metric mini-metric--${tone}`}>
      <small>{title}</small>
      <strong>{value}</strong>
      <span>â–² +2.35%</span>
    </div>
  );
}

function InvestmentCard({
  icon,
  tone,
  title,
  description,
}: {
  icon: string;
  tone: string;
  title: string;
  description: string;
}) {
  return (
    <article
      className={`aqr-investment-card aqr-investment-card--${tone}`}
    >
      <div className="aqr-investment-card__icon">
        {icon}
      </div>

      <h3>{title}</h3>

      <p>{description}</p>

      <button type="button">
        Ketahui Lebih Lanjut
        <span>â†’</span>
      </button>
    </article>
  );
}

function StepCard({
  number,
  icon,
  title,
  description,
}: {
  number: string;
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <article className="aqr-step">
      <span className="aqr-step__number">{number}</span>

      <div className="aqr-step__icon">{icon}</div>

      <h3>{title}</h3>

      <p>{description}</p>
    </article>
  );
}

function FooterColumn({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  return (
    <div className="aqr-footer__column">
      <h4>{title}</h4>

      {items.map((item) => (
        <button
          key={item}
          type="button"
          onClick={() =>
            window.scrollTo({
              top: 0,
              behavior: "smooth",
            })
          }
        >
          {item}
        </button>
      ))}
    </div>
  );
}

export default Home;


