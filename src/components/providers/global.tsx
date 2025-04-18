"use client";

import {
  FC,
  FunctionComponent,
  PropsWithChildren,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  ConnectionProvider,
  ConnectionProviderProps,
  useWallet,
  WalletProvider,
  WalletProviderProps,
} from "@solana/wallet-adapter-react";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";

import { TorqueProvider } from "@torque-labs/react";

import ENV from "#lib/environment";

/**
 * Assert the types of the components so that they are compatible with React 19.
 */
const ConnectionProviderComponent =
  ConnectionProvider as FunctionComponent<ConnectionProviderProps>;

const WalletProviderComponent =
  WalletProvider as FunctionComponent<WalletProviderProps>;

/**
 * Pass the wallet to the TorqueProvider.
 */
const TorqueProviderWrapper = ({ children }: PropsWithChildren) => {
  const { wallet } = useWallet();

  return (
    <TorqueProvider
      wallet={wallet?.adapter}
      options={{
        apiUrl: ENV.API_URL,
        rpcUrl: ENV.RPC_URL,
        authDomain: ENV.APP_URL,
      }}
    >
      {children}
    </TorqueProvider>
  );
};

export const GlobalProvider: FC<PropsWithChildren> = ({ children }) => {
  const wallets = useMemo(
    () =>
      typeof window !== "undefined"
        ? [new PhantomWalletAdapter(), new SolflareWalletAdapter()]
        : [],
    []
  );

  const [searchParams, setSearchParams] = useState<URLSearchParams>(
    {} as URLSearchParams
  );
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window) {
      const params = new URL(window.location.href).searchParams;
      setSearchParams(params);
      setIsReady(true);
    }
  }, []);

  return (
    <ConnectionProviderComponent endpoint={ENV.RPC_URL}>
      <WalletProviderComponent autoConnect wallets={wallets}>
        <TorqueProviderWrapper>{children}</TorqueProviderWrapper>
      </WalletProviderComponent>
    </ConnectionProviderComponent>
  );
};
