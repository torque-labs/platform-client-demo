"use server";

import { Helius } from "helius-sdk";

if (!process.env.HELIUS_API_KEY) {
  throw new Error("HELIUS_API_KEY is not set");
}

const helius = new Helius(process.env.HELIUS_API_KEY, process.env.NETWORK ?? "mainnet-beta");

/**
 * Get token details from Helius
 *
 * @param address - The address of the token
 * @returns Token details
 */
export async function getTokenDetails(address: string) {
  try {
    const response = await helius.rpc.getAsset({ id: address });

    const token = {
      name: response.content?.metadata.name ?? address,
      symbol: response.content?.metadata.symbol,
      image: response.content?.links?.image,
      decimals: response.token_info?.decimals ?? 0,
      usdcPerToken:
        response.token_info?.price_info?.currency === "USDC"
          ? response.token_info.price_info.price_per_token
          : 1,
      tokenStandard: response.content?.metadata?.token_standard,
      isCompressed: response.compression?.compressed,
    };

    return token;
  } catch (e) {
    console.error("Error fetching token details", e);
  }
}
