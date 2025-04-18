if (!process.env.NEXT_PUBLIC_RPC_URL) {
  throw new Error("NEXT_PUBLIC_RPC_URL is not set");
}

const ENV = {
  APP_URL: process.env.NEXT_PUBLIC_APP_URL
    ? process.env.NEXT_PUBLIC_APP_URL
    : "http://localhost:3002",
  API_URL: process.env.NEXT_PUBLIC_API_URL
    ? process.env.NEXT_PUBLIC_API_URL
    : "https://server-staging.torque.so",
  RPC_URL: process.env.NEXT_PUBLIC_RPC_URL ?? "",
} as const;

export default ENV;
