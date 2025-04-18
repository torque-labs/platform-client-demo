"use client";

import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";

import { cn } from "#/lib/utils";

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "torque-peer torque-inline-flex torque-h-5 torque-w-9 torque-shrink-0 torque-cursor-pointer torque-items-center torque-rounded-full torque-border-2 torque-border-transparent torque-shadow-sm torque-transition-colors focus-visible:torque-outline-none focus-visible:torque-ring-2 focus-visible:torque-ring-ring focus-visible:torque-ring-offset-2 focus-visible:torque-ring-offset-background disabled:torque-cursor-not-allowed disabled:torque-opacity-50 data-[state=checked]:torque-bg-primary data-[state=unchecked]:torque-bg-input",
      className,
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        "torque-pointer-events-none torque-block torque-h-4 torque-w-4 torque-rounded-full torque-bg-background torque-shadow-lg torque-ring-0 torque-transition-transform data-[state=checked]:torque-translate-x-4 data-[state=unchecked]:torque-translate-x-0",
      )}
    />
  </SwitchPrimitives.Root>
));
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
