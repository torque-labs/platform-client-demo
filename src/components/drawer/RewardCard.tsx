"use client";
import { useMemo } from "react";

import { cn } from "#/lib/utils";
import { useTokenDetails } from "#/hooks/use-token-details";
import { Card } from "#/components/Card";

interface RewardCardProps {
  amount: number;
  token: string;
  className?: string;
  fetchInfo?: boolean;
}

export function RewardCard({
  amount,
  token,
  className,
  fetchInfo = true,
}: RewardCardProps) {
  const { data: tokenDetails, isLoading: tokenDetailsLoading } =
    useTokenDetails({
      address: token,
      enabled: fetchInfo,
    });

  const formatter = new Intl.NumberFormat("en-US", {
    minimumSignificantDigits: 2,
    maximumSignificantDigits: 4,
  });

  const usdFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumSignificantDigits: 1,
    minimumFractionDigits: 2,
    maximumSignificantDigits: 6,
  });

  const usdAmount = useMemo(() => {
    return amount * (tokenDetails?.usdcPerToken ?? 0);
  }, [amount, tokenDetails?.usdcPerToken]);

  return (
    <Card
      className={cn(
        "torque-gap-2 torque-h-32 torque-w-40 torque-cursor-pointer hover:torque-bg-white/5",
        className
      )}
      innerClassName="torque-relative torque-h-full torque-items-center torque-flex-col torque-justify-end"
      isLoading={tokenDetailsLoading}
    >
      {tokenDetails?.image ? (
        <div
          className="torque-z-0 torque-absolute torque-w-full torque-h-full torque-left-0 torque-top-0 torque-filter torque-blur-md torque-opacity-30"
          style={{
            backgroundImage: `url("${tokenDetails?.image}")`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>
      ) : null}

      <div className="torque-relative torque-z-[1] torque-w-full torque-flex torque-flex-col torque-items-center torque-justify-end">
        <div className="torque-size-9 torque-rounded-md torque-bg-white/10 torque-border torque-border-white/20 torque-mb-3 torque-overflow-hidden">
          {tokenDetails?.image ? (
            <img
              src={tokenDetails.image}
              alt={tokenDetails.symbol}
              className="torque-w-full torque-h-full torque-object-cover torque-object-center"
            />
          ) : null}
        </div>

        <div className="torque-text-[13px] torque-font-medium">
          {formatter.format(amount)}{" "}
          {tokenDetails?.symbol ??
            `${token.toString().slice(0, 5)}....${token.toString().slice(-5)}`}
        </div>

        {usdAmount > 0 ? (
          <div className="torque-text-[12px] torque-text-muted-foreground">
            &#8776; {usdFormatter.format(usdAmount)}
          </div>
        ) : null}
      </div>
    </Card>
  );
}
