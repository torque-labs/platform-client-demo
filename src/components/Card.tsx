import { PropsWithChildren } from "react";
import { cn } from "#/lib/utils";

interface CardProps extends PropsWithChildren {
  innerClassName?: string;
  className?: string;
  isLoading?: boolean;
}

export function Card({ children, innerClassName, className, isLoading }: CardProps) {
  return (
    <div className={cn("torque-p-1 torque-rounded-xl torque-border-white/20 torque-border", className)}>
      <div
        className={cn(
          "torque-flex torque-flex-col torque-p-3 torque-rounded-lg torque-bg-white/10 torque-border torque-border-white/20 torque-overflow-hidden",
          { "torque-animate-pulse": isLoading },
          innerClassName,
        )}
      >
        {!isLoading ? children : null}
      </div>
    </div>
  );
}
