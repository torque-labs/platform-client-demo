"use client";

import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { Drawer as DrawerPrimitive } from "vaul";

import { cn } from "#/lib/utils";

const drawerVariants = cva("torque-fixed torque-z-50 torque-flex torque-flex-col torque-bg-background", {
  variants: {
    side: {
      top: "torque-inset-x-0 torque-top-0 torque-border-b",
      bottom: "torque-inset-x-0 torque-bottom-0 torque-border-t",
      left: "torque-inset-y-0 torque-left-0 torque-h-full torque-w-3/4 torque-border-r sm:torque-max-w-sm",
      right:
        "torque-inset-y-0 torque-right-0 torque-h-full torque-w-full torque-max-w-[365px] torque-border-l torque-m-0",
    },
  },
  defaultVariants: {
    side: "right",
  },
});

export interface DrawerContentProps
  extends React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Content>,
    VariantProps<typeof drawerVariants> {}

function Drawer({
  shouldScaleBackground = true,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Root>) {
  return <DrawerPrimitive.Root shouldScaleBackground={shouldScaleBackground} {...props} />;
}
Drawer.displayName = "Drawer";

const DrawerTrigger = DrawerPrimitive.Trigger;

const DrawerPortal = DrawerPrimitive.Portal;

const DrawerClose = DrawerPrimitive.Close;

const DrawerOverlay = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Overlay
    className={cn(
      "torque-fixed torque-overflow-hidden torque-inset-0 torque-z-50 torque-bg-black/50",
      className,
    )}
    ref={ref}
    {...props}
  />
));
DrawerOverlay.displayName = DrawerPrimitive.Overlay.displayName;

const DrawerContent = React.forwardRef<React.ElementRef<typeof DrawerPrimitive.Content>, DrawerContentProps>(
  ({ side = "right", className, children, ...props }, ref) => (
    <DrawerPortal>
      <DrawerOverlay />
      <DrawerPrimitive.Content
        className={cn(
          "torque-fixed torque-inset-x-0 torque-bottom-0 torque-z-50 torque-flex torque-h-auto torque-flex-col torque-border-border torque-bg-background torque-text-white",
          drawerVariants({ side }),
          className,
        )}
        ref={ref}
        {...props}
      >
        {children}
      </DrawerPrimitive.Content>
    </DrawerPortal>
  ),
);
DrawerContent.displayName = DrawerPrimitive.Content.displayName;

function DrawerHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "torque-grid torque-gap-1.5 torque-p-4 torque-text-center sm:torque-text-left",
        className,
      )}
      {...props}
    />
  );
}
DrawerHeader.displayName = "DrawerHeader";

function DrawerFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("torque-mt-auto torque-flex torque-flex-col torque-gap-2 torque-p-4", className)}
      {...props}
    />
  );
}
DrawerFooter.displayName = "DrawerFooter";

const DrawerTitle = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Title
    className={cn("torque-text-lg torque-font-semibold torque-leading-none torque-tracking-tight", className)}
    ref={ref}
    {...props}
  />
));
DrawerTitle.displayName = DrawerPrimitive.Title.displayName;

const DrawerDescription = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Description
    className={cn("torque-text-sm torque-text-muted-foreground", className)}
    ref={ref}
    {...props}
  />
));
DrawerDescription.displayName = DrawerPrimitive.Description.displayName;

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
};
