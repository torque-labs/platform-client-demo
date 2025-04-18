import { ChevronRight } from "lucide-react";

import { OfferResponse } from "@torque-labs/sdk";

import { cn } from "#/lib/utils";

interface OfferListItemProps {
  offer: OfferResponse;
  className?: string;
  onClick?: () => void;
}

/**
 * Displays an offer as a component to be used as part of a list
 */
export function OfferListItem({
  offer,
  className,
  onClick,
}: OfferListItemProps) {
  const title = offer.metadata.title;
  const description = offer.metadata.description;
  const imageSrc = offer.metadata.image;

  return (
    <div
      className={cn(
        "torque-gap-4 torque-rounded torque-border torque-border-white/20",
        className
      )}
    >
      <div className="torque-flex torque-flex-col torque-gap-2 torque-p-3">
        <div
          className="torque-flex torque-w-full torque-items-center torque-gap-3"
          onClick={onClick}
          role="button"
          tabIndex={0}
        >
          {imageSrc ? (
            <img
              className="torque-h-12 torque-w-12 torque-rounded-sm"
              src={imageSrc}
              alt={`${title} image`}
            />
          ) : null}

          <div className="torque-flex-1">
            <h3 className="torque-font-semibold torque-leading-tight torque-flex torque-justify-between torque-text-sm">
              {title}
            </h3>
          </div>

          <ChevronRight className="torque-size-5 torque-text-white" size={16} />
        </div>

        <p className="torque-mr-5 torque-text-xs torque-text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
}
