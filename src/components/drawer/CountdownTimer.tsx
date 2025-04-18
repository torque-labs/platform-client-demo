"use client";

import { useEffect, useState } from "react";
import { cn } from "#/lib/utils";

interface CountdownTimerProps {
  title?: string;
  countdownTo: Date;
  countdownFrom: Date;
  className?: string;
}

export function CountdownTimer({ title, countdownTo, countdownFrom, className }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = Date.now();
      const difference = countdownTo.getTime() - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      }

      const totalDuration = countdownTo.getTime() - countdownFrom.getTime();
      const elapsed = now - countdownFrom.getTime();
      const newProgress = Math.max(0, Math.min(100, (1 - elapsed / totalDuration) * 100));

      setProgress(newProgress);
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [countdownTo, countdownFrom]);

  return (
    <div className={cn("torque-w-full torque-mb-4", className)}>
      {title ? (
        <h3 className="torque-text-center torque-text-muted-foreground torque-text-xs torque-mb-1">
          {title}
        </h3>
      ) : null}
      <div
        className={cn(
          "torque-grid torque-text-center torque-py-2 torque-border torque-rounded-md torque-bg-background/5",
          timeLeft.days > 0 ? "torque-grid-cols-4" : "torque-grid-cols-3",
          "torque-divide-x torque-divide-border/20",
        )}
      >
        {timeLeft.days > 0 && (
          <div className="torque-flex torque-flex-col torque-items-center torque-px-2">
            <span className="torque-text-lg torque-leading-none torque-font-mono">
              {String(timeLeft.days).padStart(2, "0")}
            </span>
            <span className="torque-text-xs torque-text-muted-foreground">days</span>
          </div>
        )}
        <div className="torque-flex torque-flex-col torque-items-center torque-px-2">
          <span className="torque-text-lg torque-leading-none torque-font-mono">
            {String(timeLeft.hours).padStart(2, "0")}
          </span>
          <span className="torque-text-xs torque-text-muted-foreground">hours</span>
        </div>
        <div className="torque-flex torque-flex-col torque-items-center torque-px-2">
          <span className="torque-text-lg torque-leading-none torque-font-mono">
            {String(timeLeft.minutes).padStart(2, "0")}
          </span>
          <span className="torque-text-xs torque-text-muted-foreground">min</span>
        </div>
        <div className="torque-flex torque-flex-col torque-items-center torque-px-2">
          <span className="torque-text-lg torque-leading-none torque-font-mono">
            {String(timeLeft.seconds).padStart(2, "0")}
          </span>
          <span className="torque-text-xs torque-text-muted-foreground">sec</span>
        </div>
      </div>

      <div className="torque-w-full torque-h-1 torque-mt-1 torque-bg-muted torque-rounded-full">
        <div
          className="torque-h-full torque-bg-gradient-to-r torque-from-green-500 torque-to-purple-500 torque-rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
