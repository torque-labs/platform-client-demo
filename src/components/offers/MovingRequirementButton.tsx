"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";

import { EventType, OfferResponse } from "@torque-labs/sdk";
import {
  useCurrentUser,
  useOfferAction,
  useSocialConnect,
  useXAction,
} from "@torque-labs/react";

import { cn } from "#/lib/utils";

interface MovingRequirementButtonProps {
  offerId: string;
  requirementId: string;
  requirement: OfferResponse["offerRequirements"][number];
  index: number;
  isCompleted: boolean;
  isStarted: boolean;
  disabled?: boolean;
  borderRadius?: string;
}

export function MovingRequirementButton({
  offerId,
  requirementId,
  requirement,
  index,
  isCompleted,
  isStarted,
  disabled = false,
  borderRadius = "0.5rem",
}: MovingRequirementButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { data: currentUser } = useCurrentUser();
  const { executeAction } = useOfferAction({ offerId, index, enabled: false });
  const { mutate: executeXAction } = useXAction();
  const { connect } = useSocialConnect();

  const hasTwitter = useMemo(() => {
    return !!currentUser?.connected.x;
  }, [currentUser]);

  const handleClick = async () => {
    if (disabled || isCompleted) return;

    console.log("Executing requirement action:", {
      offerId,
      requirementId,
      index,
      requirement,
    });

    switch (requirement.type) {
      case EventType.X_FOLLOW:
      case EventType.X_LIKE:
      case EventType.X_REPOST:
        if (hasTwitter && requirement.config.targetId.value) {
          executeXAction({
            targetType: requirement.type,
            targetId: requirement.config.targetId.value,
          });
        } else {
          console.error(
            "No twitter connected. Twitter can be connected in the platform."
          );

          connect("twitter", "http://localhost:3002", true);
        }
        break;
      default:
        executeAction.mutate({ offerId, index });
        break;
    }
  };

  return (
    <div
      className={cn(
        "torque-relative torque-overflow-hidden",
        "torque-w-full torque-p-[1px]",
        disabled
          ? "torque-opacity-50 torque-cursor-not-allowed"
          : "torque-cursor-pointer"
      )}
      style={{ borderRadius }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      <motion.div
        className="torque-absolute torque-inset-0 torque-bg-gradient-to-r torque-from-green-500 torque-to-purple-500"
        style={{ borderRadius }}
        animate={{
          background: isHovered
            ? "linear-gradient(to right, rgb(34, 197, 94), rgb(168, 85, 247))"
            : "linear-gradient(to right, rgb(34, 197, 94, 0.5), rgb(168, 85, 247, 0.5))",
        }}
      />

      <div
        className="torque-relative torque-bg-background torque-p-3 torque-flex torque-items-center torque-justify-between"
        style={{ borderRadius: `calc(${borderRadius} - 1px)` }}
      >
        <div className="torque-flex torque-flex-col torque-gap-1">
          <span className="torque-text-sm torque-font-medium">
            Complete Requirement
          </span>
          <span className="torque-text-xs torque-text-muted-foreground">
            {requirement.type}
          </span>
        </div>

        <div className="torque-flex torque-items-center torque-gap-2">
          {isCompleted ? (
            <span className="torque-text-xs torque-text-green-500">
              Completed
            </span>
          ) : (
            <span className="torque-text-xs torque-text-yellow-500">
              {isStarted ? "In Progress" : "Not Started"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
