"use client";

import { useOffer } from "@torque-labs/react";

interface OfferDetailsProps {
  offerId: string;
}

export function OfferDetails({ offerId }: OfferDetailsProps) {
  const { data: offer } = useOffer({ offerId });

  return (
    <div>
      <h1>Offer Details</h1>
      <pre>{JSON.stringify(offer, undefined, 2)}</pre>
    </div>
  );
}
