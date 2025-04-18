"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";

import { cn } from "#/lib/utils";

const Dialog = DialogPrimitive.Root;

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = DialogPrimitive.Portal;

const DialogClose = DialogPrimitive.Close;

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "torque-fixed torque-inset-0 torque-z-50 torque-bg-black/80 torque- data-[state=open]:torque-animate-in data-[state=closed]:torque-animate-out data-[state=closed]:torque-fade-out-0 data-[state=open]:torque-fade-in-0",
      className,
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "torque-fixed torque-left-[50%] torque-top-[50%] torque-z-50 torque-grid torque-w-full torque-max-w-lg torque-translate-x-[-50%] torque-translate-y-[-50%] torque-gap-4 torque-border torque-bg-background torque-p-6 torque-shadow-lg torque-duration-200 data-[state=open]:torque-animate-in data-[state=closed]:torque-animate-out data-[state=closed]:torque-fade-out-0 data-[state=open]:torque-fade-in-0 data-[state=closed]:torque-zoom-out-95 data-[state=open]:torque-zoom-in-95 data-[state=closed]:torque-slide-out-to-left-1/2 data-[state=closed]:torque-slide-out-to-top-[48%] data-[state=open]:torque-slide-in-from-left-1/2 data-[state=open]:torque-slide-in-from-top-[48%] sm:torque-rounded-lg",
        className,
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="torque-absolute torque-right-4 torque-top-4 torque-rounded-sm torque-opacity-70 torque-ring-offset-background torque-transition-opacity hover:torque-opacity-100 focus:torque-outline-none focus:torque-ring-2 focus:torque-ring-ring focus:torque-ring-offset-2 disabled:torque-pointer-events-none data-[state=open]:torque-bg-accent data-[state=open]:torque-text-muted-foreground">
        <X className="torque-h-4 torque-w-4" />
        <span className="torque-sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "torque-flex torque-flex-col torque-space-y-1.5 torque-text-center sm:torque-text-left",
      className,
    )}
    {...props}
  />
);
DialogHeader.displayName = "DialogHeader";

const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "torque-flex torque-flex-col-reverse sm:torque-flex-row sm:torque-justify-end sm:torque-space-x-2",
      className,
    )}
    {...props}
  />
);
DialogFooter.displayName = "DialogFooter";

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("torque-text-lg torque-font-semibold torque-leading-none torque-tracking-tight", className)}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("torque-text-sm torque-text-muted-foreground", className)}
    {...props}
  />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
