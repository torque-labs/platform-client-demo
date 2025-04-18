import { useEffect, useState } from "react";

import { ChevronLeft } from "lucide-react";

import { OfferJourneyReturn, OfferResponse, EventType } from "@torque-labs/sdk";
import { useOfferJourney, useStartOffer, useTorque } from "@torque-labs/react";

import { RewardCard } from "./RewardCard";
import { MovingBorderButton } from "#components/MovingBorderButton";
import { Skeleton } from "#components/ui/skeleton";
import { Button } from "#components/ui/button";
import { CountdownTimer } from "#components/drawer/CountdownTimer";
import { MovingRequirementButton } from "#components/offers/MovingRequirementButton";
import { getFunctionOutput } from "#lib/distributors";

interface OfferDetailsProps {
  /**
   * The offer to display
   */
  offer: OfferResponse;

  /**
   * Callback function when the offer details are closed
   */
  onClose: () => void;
}

/**
 * Shows the details of an offer inside of a drawer.
 */
export function OfferDetails({ offer, onClose }: OfferDetailsProps) {
  const { mutate: startOffer } = useStartOffer();
  const { data: offerJourneys, isLoading: isLoadingJourneys } = useOfferJourney(
    { offerId: offer.id }
  );
  const { isAuthenticated } = useTorque();

  const title = offer.metadata.title;
  const description = offer.metadata.description;
  const imageSrc = offer.metadata.image;

  const [isEligible, setIsEligible] = useState<boolean>(false);
  const [isStarted, setIsStarted] = useState<boolean>(false);
  const [currentJourney, setCurrentJourney] = useState<OfferJourneyReturn>();
  const [hasCompleted, setHasCompleted] = useState<boolean>(false);

  console.log("Offer opened in drawer:", {
    offer,
    metadata: offer.metadata,
    requirements: offer.offerRequirements,
    distributors: offer.distributors,
    status: offer.status,
    fullOffer: JSON.stringify(offer, null, 2),
  });

  console.log("Current journey state:", {
    offerJourneys,
    currentJourney,
    isStarted,
    isEligible,
    isAuthenticated,
  });

  useEffect(() => {
    if (offer && offerJourneys) {
      const startedJourney = offerJourneys.find(
        (journey) => journey.status === "STARTED"
      );

      const hasCompletedJourney = offerJourneys.some(
        (journey) => journey.status === "DONE" && journey.conversion
      );

      setHasCompleted(hasCompletedJourney);

      // User is eligible only if:
      // 1. They are authenticated
      // 2. They have a started journey
      // 3. They haven't already completed the offer
      const hasStarted =
        !!startedJourney && isAuthenticated && !hasCompletedJourney;

      console.log("[OfferPage] Journey and eligibility state:", {
        isAuthenticated,
        hasStartedJourney: !!startedJourney,
        hasCompletedJourney,
        startedJourneyStatus: startedJourney?.status,
        isStarted: hasStarted,
        isEligible: hasStarted,
      });

      setIsStarted(hasStarted);
      setCurrentJourney(startedJourney);
      setIsEligible(hasStarted);
    } else {
      setHasCompleted(false);
      setIsEligible(false);
      setIsStarted(false);
      setCurrentJourney(undefined);
    }
  }, [offer, offerJourneys, isAuthenticated]);

  if (isLoadingJourneys) {
    return (
      <div className="torque-flex torque-w-full torque-flex-col torque-p-4 torque-pt-2">
        <Button
          className="torque-mb-3 torque-flex torque-items-center torque-self-start torque-py-1 torque-pl-0 torque-text-sm torque-font-normal hover:torque-bg-transparent"
          onClick={onClose}
          variant="ghost"
        >
          <ChevronLeft className="torque-size-4" size={16} />
          <span>Back</span>
        </Button>

        {/* Image Skeleton */}
        <Skeleton className="torque-mb-4 torque-aspect-square torque-w-full torque-rounded-md" />

        {/* Title and Description Skeletons */}
        <div className="torque-mb-3 torque-flex torque-flex-col torque-gap-2">
          <Skeleton className="torque-h-6 torque-w-3/4" />
          <Skeleton className="torque-h-4 torque-w-full" />
        </div>

        {/* Timer Skeleton */}
        <Skeleton className="torque-mb-6 md:torque-mb-8 torque-h-[60px] torque-w-full torque-rounded-lg" />

        {/* Rewards Section Skeleton */}
        <div className="torque-mt-4">
          <Skeleton className="torque-mb-2 torque-h-5 torque-w-20" />
          <div className="torque-grid torque-grid-cols-1 sm:torque-grid-cols-2 torque-gap-2">
            <Skeleton className="torque-h-[100px] torque-rounded-lg" />
            <Skeleton className="torque-h-[100px] torque-rounded-lg" />
          </div>
        </div>

        {/* Requirements Section Skeleton */}
        <div className="torque-mt-4">
          <div className="torque-flex torque-items-center torque-justify-between torque-mb-2">
            <Skeleton className="torque-h-5 torque-w-24" />
            <Skeleton className="torque-h-4 torque-w-12" />
          </div>
          <div className="torque-flex torque-flex-col torque-gap-2">
            <Skeleton className="torque-h-[60px] torque-rounded-lg" />
            <Skeleton className="torque-h-[60px] torque-rounded-lg" />
            <Skeleton className="torque-h-[60px] torque-rounded-lg" />
          </div>
        </div>

        {/* Conditions Section Skeleton */}
        <div className="torque-mt-4">
          <Skeleton className="torque-mb-2 torque-h-5 torque-w-24" />
          <div className="torque-space-y-2">
            <Skeleton className="torque-h-4 torque-w-full" />
            <Skeleton className="torque-h-4 torque-w-3/4" />
            <Skeleton className="torque-h-4 torque-w-5/6" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="torque-flex torque-w-full torque-flex-col torque-p-4 torque-pt-2">
      <Button
        className="torque-mb-3 torque-flex torque-items-center torque-self-start torque-py-1 torque-pl-0 torque-text-sm torque-font-normal hover:torque-bg-transparent"
        onClick={onClose}
        variant="ghost"
      >
        <ChevronLeft className="torque-size-4" size={16} />
        <span>Back</span>
      </Button>

      {imageSrc ? (
        <div className="torque-mb-4 torque-w-full">
          <img
            alt={title}
            className="torque-aspect-square torque-w-full torque-overflow-hidden torque-rounded-md torque-object-cover"
            src={imageSrc}
          />
        </div>
      ) : null}

      <div className="torque-mb-3 torque-flex torque-flex-col torque-gap-2">
        <h3 className="torque-text-base torque-font-semibold torque-leading-snug">
          {title}
        </h3>

        <p className="torque-text-xs torque-text-muted">{description}</p>
      </div>

      {offer.status === "ACTIVE" ? (
        <>
          <CountdownTimer
            title="Time Remaining"
            countdownFrom={new Date(offer.startTime)}
            countdownTo={new Date(offer.endTime)}
            className="torque-mb-6 md:torque-mb-8"
          />

          {!isStarted && !hasCompleted ? (
            <div className="torque-w-full torque-mb-6 md:torque-mb-8">
              <div
                className="torque-cursor-pointer"
                onClick={() => {
                  if (isAuthenticated && !hasCompleted) {
                    startOffer({ offerId: offer.id });
                  }
                }}
              >
                <MovingBorderButton
                  className="torque-text-lg md:torque-text-xl torque-font-medium"
                  duration={3000}
                  borderRadius="0.5rem"
                >
                  {hasCompleted ? "Offer Completed" : "Claim Offer"}
                </MovingBorderButton>
              </div>
            </div>
          ) : null}

          {hasCompleted && (
            <div className="torque-w-full torque-mb-6 md:torque-mb-8 torque-p-4 torque-bg-background/50 torque-rounded-lg">
              <p className="torque-text-center torque-text-white/70">
                You have already completed this offer
              </p>
            </div>
          )}
        </>
      ) : null}

      <div className="torque-mt-4">
        <h4 className="torque-mb-2 torque-text-sm torque-font-medium">
          Rewards
        </h4>
        <div className="torque-grid torque-grid-cols-1 sm:torque-grid-cols-2 torque-gap-2 torque-w-full">
          {offer.distributors.map((distro) => {
            const isAsymmetricOrPoints =
              distro.type === "ASYMMETRIC" || distro.emissionType === "POINTS";

            if (!distro.distributionFunction) {
              return null;
            }

            const reward = isAsymmetricOrPoints
              ? Number(distro.totalFundAmount)
              : getFunctionOutput(
                  {
                    ...distro.distributionFunction,
                    yIntercept: Number(distro.distributionFunction?.yIntercept),
                  },
                  0,
                  false,
                  distro.tokenDecimals
                );

            const tokenAddress =
              distro.emissionType === "TOKENS" && distro.tokenAddress
                ? distro.tokenAddress
                : distro.emissionType === "SOL"
                ? "So11111111111111111111111111111111111111112"
                : distro.emissionType === "POINTS"
                ? "Points"
                : "";

            return (
              <RewardCard
                key={distro.id}
                amount={reward}
                token={tokenAddress}
                fetchInfo={
                  distro.emissionType === "TOKENS" ||
                  distro.emissionType === "SOL"
                }
              />
            );
          })}
        </div>
      </div>

      <div className="torque-mt-4">
        <div className="torque-flex torque-items-center torque-justify-between torque-mb-2">
          <h4 className="torque-text-sm torque-font-medium">Requirements</h4>
          <span className="torque-text-xs torque-text-muted-foreground">
            {(currentJourney?.requirementJourneys ?? []).filter((req) =>
              ["DONE", "PENDING", "STAGED"].includes(req.status)
            ).length ?? 0}{" "}
            / {offer.offerRequirements.length}
          </span>
        </div>
        <div className="torque-flex torque-flex-col torque-gap-2">
          {offer.offerRequirements.map((requirement, idx) => {
            const isSupported = [
              EventType.BUY,
              EventType.X_COMMENT,
              EventType.X_LIKE,
              EventType.X_FOLLOW,
              EventType.X_REPOST,
            ].includes(requirement.type as EventType);

            const completedRequirement =
              currentJourney?.requirementJourneys?.find(
                (journeyReq) =>
                  journeyReq.offerRequirementId === requirement.id &&
                  journeyReq.status !== "STARTED"
              );

            console.log("Requirement button state:", {
              isSupported,
              isEligible,
              isStarted,
              isAuthenticated,
              requirement: requirement.type,
            });

            return (
              <div key={requirement.id}>
                <MovingRequirementButton
                  offerId={offer.id}
                  requirementId={requirement.id}
                  requirement={requirement}
                  index={idx}
                  isCompleted={!!completedRequirement || hasCompleted}
                  isStarted={isStarted}
                  disabled={
                    !isSupported ||
                    !isEligible ||
                    !isStarted ||
                    !isAuthenticated ||
                    hasCompleted
                  }
                  borderRadius="0.5rem"
                />
              </div>
            );
          })}
        </div>
      </div>

      <div className="torque-mt-4">
        <h4 className="torque-mb-2 torque-text-sm torque-font-medium">
          Conditions
        </h4>
        <ul className="torque-space-y-2">
          {offer.distributors.map((distro) => {
            const maxPerUser =
              Number(
                distro.crankGuard?.availability?.maxConversionsPerRecipient
              ) ?? 0;
            const maxTotal =
              distro.crankGuard?.availability?.maxTotalConversions;
            const activationType = distro.crankGuard?.activation?.type;

            return (
              <li
                key={distro.id}
                className="torque-text-xs torque-text-muted-foreground"
              >
                {maxPerUser === 1
                  ? "• Limited to 1 per user"
                  : maxPerUser > 1
                  ? `• Limited to ${maxPerUser} per user`
                  : "• Unlimited claims per user"}

                {maxTotal !== null && maxTotal !== undefined && (
                  <div>• Total availability: {maxTotal}</div>
                )}

                <div>
                  •{" "}
                  {activationType === "OFFER_CONCLUSION"
                    ? "Distributed after offer ends"
                    : "Available after completing requirements"}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
