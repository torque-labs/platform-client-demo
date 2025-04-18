import { useCallback, useMemo } from "react";
import { type WalletName, WalletReadyState } from "@solana/wallet-adapter-base";
import { useWallet } from "@solana/wallet-adapter-react";
import { useTorque } from "@torque-labs/react";

import { Button } from "#components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "#components/ui/dialog";
import { Switch } from "#components/ui/switch";
import ENV from "#lib/environment";

const walletLinkMap = {
  solflare: "https://solflare.com/ul/v1/browse/",
  phantom: "https://phantom.app/ul/browse/",
} as const;

const getWalletLink = (walletName: WalletName) => {
  const name = walletName.toLowerCase();

  if (name.includes("phantom")) {
    return walletLinkMap.phantom;
  }

  if (name.includes("solflare")) {
    return walletLinkMap.solflare;
  }
};

export function TorqueConnectDialog() {
  const {
    isAuthenticated,
    connectModalOpen,
    useTransactionForAuth,
    authenticate,
    setConnectModalOpen,
    setUseTransactionForAuth,
  } = useTorque();

  const { wallets, select } = useWallet();

  const walletsList = useMemo(() => {
    return wallets.map((wal) => {
      const linkPrefix = getWalletLink(wal.adapter.name);
      const url = encodeURIComponent(window.location.href);
      const ref = encodeURIComponent(window.location.origin);

      const link = linkPrefix
        ? `${linkPrefix}${url}?ref=${ref}`
        : "https://platform.torque.so";

      return {
        name: wal.adapter.name,
        icon: wal.adapter.icon,
        link,
        enabled: wal.readyState === WalletReadyState.Installed,
      };
    });
  }, [wallets]);

  const connectToWallet = useCallback(
    async (walletName: WalletName) => {
      try {
        setConnectModalOpen(false);
        select(walletName);

        await authenticate(undefined, ENV.APP_URL);
      } catch (error) {
        console.error(error);
      }
    },
    [select, setConnectModalOpen, authenticate]
  );

  const showLedgerSwitch = useMemo(() => {
    return (
      walletsList.filter(
        (wal) => wal.enabled && !wal.name.toLowerCase().includes("tiplink")
      ).length > 0
    );
  }, [walletsList]);

  return (
    <Dialog
      onOpenChange={(open: boolean) => {
        if (!open) {
          // Reset the useTransactionForAuth state when closing the dialog
          setUseTransactionForAuth(false);
        }

        setConnectModalOpen(open);
      }}
      open={connectModalOpen ? !isAuthenticated : false}
    >
      <DialogContent className="torque-text-foreground torque-border-white/20">
        <DialogHeader className="torque-mb-4">
          <DialogTitle>Connect your Wallet</DialogTitle>
          <DialogDescription>
            Select your wallet bellow to connect and login to Torque.
          </DialogDescription>
        </DialogHeader>

        <div className="torque-flex torque-flex-col torque-gap-4">
          {showLedgerSwitch ? (
            <div className="torque-flex torque-items-center torque-gap-2">
              <Switch
                checked={useTransactionForAuth}
                onCheckedChange={setUseTransactionForAuth}
              />

              <span>Use Ledger?</span>
            </div>
          ) : null}

          {walletsList.map((wal) =>
            wal.enabled ? (
              <Button
                className="torque-w-full torque-gap-2"
                key={`wallet-picker-${wal.name}`}
                onClick={async () => {
                  await connectToWallet(wal.name);
                }}
                size="lg"
                variant="outline"
              >
                {wal.icon ? (
                  <img
                    alt={wal.name}
                    className="torque-size-4"
                    src={wal.icon}
                  />
                ) : null}

                <div className="torque-flex torque-items-center torque-gap-2">
                  <span>Connect with {wal.name}</span>

                  <span className="torque-text-[10px] torque-text-muted-foreground">
                    (detected)
                  </span>
                </div>
              </Button>
            ) : (
              <Button
                asChild
                className="torque-w-full torque-gap-2"
                key={`wallet-picker-${wal.name}`}
                size="lg"
                variant="outline"
              >
                <a
                  href={wal.link}
                  key={`wallet-link-${wal.name}`}
                  rel="noopener"
                  target="_blank"
                >
                  {wal.icon ? (
                    <img
                      alt={wal.name}
                      className="torque-size-4"
                      src={wal.icon}
                    />
                  ) : null}

                  <div className="torque-flex torque-items-center torque-gap-2">
                    <span>Connect with {wal.name}</span>
                  </div>
                </a>
              </Button>
            )
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
