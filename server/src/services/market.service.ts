export type MarketItem = {
  symbol: string;
  name: string;
  value: string;
  change: string;
  tone: "blue" | "purple" | "cyan" | "red";
  negative?: boolean;
};

const markets: MarketItem[] = [
  {
    symbol: "BTC/MYR",
    name: "Bitcoin",
    value: "RM 298,432.10",
    change: "+2.35%",
    tone: "blue",
  },
  {
    symbol: "ETH/MYR",
    name: "Ethereum",
    value: "RM 12,845.30",
    change: "+1.28%",
    tone: "purple",
  },
  {
    symbol: "KLCI",
    name: "FTSE Bursa Malaysia KLCI",
    value: "1,642.38",
    change: "+0.56%",
    tone: "cyan",
  },
  {
    symbol: "USD/MYR",
    name: "US Dollar / Malaysian Ringgit",
    value: "RM 4.7120",
    change: "-0.24%",
    tone: "red",
    negative: true,
  },
];

export function getMarketOverview() {
  return markets;
}
