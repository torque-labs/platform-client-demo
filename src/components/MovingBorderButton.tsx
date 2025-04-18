"use client";

import {
  motion,
  useAnimationFrame,
  useMotionTemplate,
  useMotionValue,
  useTransform,
} from "framer-motion";
import React, { useRef } from "react";
import { cn } from "#/lib/utils";

interface MovingBorderProps extends React.SVGProps<SVGSVGElement> {
  duration?: number;
  rx?: string;
  ry?: string;
}

const MovingBorder = ({
  children,
  duration = 2000,
  rx,
  ry,
  ...otherProps
}: MovingBorderProps) => {
  const pathRef = useRef<SVGRectElement>(null);
  const progress = useMotionValue<number>(0);

  useAnimationFrame((time) => {
    const length = pathRef.current?.getTotalLength();
    if (length) {
      const pxPerMillisecond = length / duration;
      progress.set((time * pxPerMillisecond) % length);
    }
  });

  const x = useTransform(
    progress,
    (val) => pathRef.current?.getPointAtLength(val).x
  );
  const y = useTransform(
    progress,
    (val) => pathRef.current?.getPointAtLength(val).y
  );

  const transform = useMotionTemplate`translateX(${x}px) translateY(${y}px) translateX(-50%) translateY(-50%)`;

  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="torque-absolute torque-size-full"
        width="100%"
        height="100%"
        {...otherProps}
      >
        <rect
          fill="none"
          width="100%"
          height="100%"
          rx={rx}
          ry={ry}
          ref={pathRef}
        />
      </svg>
      <motion.div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          display: "inline-block",
          transform,
        }}
      >
        {children}
      </motion.div>
    </>
  );
};

interface MovingBorderButtonProps {
  borderRadius?: string;
  containerClassName?: string;
  borderClassName?: string;
  duration?: number;
  className?: string;
  disabled?: boolean;
  children: React.ReactNode;
}

export function MovingBorderButton({
  borderRadius = "1.75rem",
  children,
  containerClassName,
  borderClassName,
  duration,
  className,
  disabled,
}: MovingBorderButtonProps) {
  return (
    <div
      className={cn(
        "torque-relative torque-h-16 torque-w-full torque-overflow-hidden torque-bg-transparent torque-p-px torque-text-xl",
        containerClassName
      )}
      style={{
        borderRadius: borderRadius,
      }}
    >
      <div
        className="torque-absolute torque-inset-0"
        style={{ borderRadius: `calc(${borderRadius} * 0.96)` }}
      >
        <MovingBorder duration={duration} rx="30%" ry="30%">
          <div
            className={cn(
              "torque-size-24 torque-border-2 torque-border-black torque-bg-button-radial-gradient torque-opacity-80",
              borderClassName
            )}
          />
        </MovingBorder>
      </div>

      <div
        className={cn(
          "torque-relative torque-flex torque-size-full torque-items-center torque-justify-center torque-border torque-border-slate-800 torque-bg-slate-900/[0.8] torque-text-white torque-antialiased torque-backdrop-blur-xl",
          { "torque-opacity-50": disabled },
          className
        )}
        style={{
          borderRadius: `calc(${borderRadius} * 0.96)`,
        }}
      >
        {children}
      </div>
    </div>
  );
}
