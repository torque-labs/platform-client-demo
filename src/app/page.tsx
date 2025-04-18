"use client";

import { useEffect, useState } from "react";

import {
  useAddDistributor,
  useCloseDistributor,
  useCreateOffer,
  useCurrentUser,
  useDeployDistributor,
  useOffers,
  useSocialConnect,
  useStartOffer,
  useTorque,
} from "@torque-labs/react";

import { TorqueConnectDialog } from "#components/dialog/TorqueConnectDialog";
import { Button } from "#components/ui/button";
import { TorqueDrawer } from "#components/drawer/TorqueDrawer";

export default function Home() {
  const [offerId, setOfferId] = useState<string>();
  const [distributorId, setDistributorId] = useState<string>();
  const [projectId, setProjectId] = useState<string>();

  const { connectModalOpen, setConnectModalOpen, isAuthenticated } =
    useTorque();

  const { data: draftOffers } = useOffers({ status: "DRAFT" });
  const { data: activeOffers } = useOffers({ status: "ACTIVE" });

  const { mutate: createOffer } = useCreateOffer({
    onSuccess: (data) => console.log("Created offer: ", data),
  });

  const { mutate: addDistributor } = useAddDistributor({
    onSuccess: (data) => console.log("Added distributor: ", data),
  });

  const { mutate: deployDistributor } = useDeployDistributor({
    onSuccess: (data) => console.log("Deployed distributor: ", data),
  });

  const { mutate: startOffer } = useStartOffer({
    onSuccess: () => console.log("Started offer"),
  });

  const { mutate: closeDistributor } = useCloseDistributor({
    onSuccess: (data) => console.log("Closed distributor", data),
  });

  const { data: currentUser, isLoading: currentUserLoading } = useCurrentUser();

  const { connect, isLoading: connectLoading } = useSocialConnect();

  useEffect(() => {
    console.log(draftOffers);
    console.log(connectModalOpen, "connectModalOpen");

    if (draftOffers && draftOffers?.length > 0) {
      setOfferId(draftOffers[0].id);

      if (draftOffers[0].distributors.length > 0) {
        setDistributorId(draftOffers[0].distributors[0].id);
      }
    }
  }, [draftOffers, connectModalOpen]);

  return (
    <div className="torque-container torque-px-4 torque-py-8 torque-mx-auto">
      {!isAuthenticated ? (
        <Button
          onClick={() => {
            setConnectModalOpen(true);
          }}
        >
          Login
        </Button>
      ) : null}

      {isAuthenticated ? (
        <div className="torque-flex torque-flex-col torque-gap-1 torque-mb-8">
          <p className="torque-text-sm">Project ID</p>
          <input
            type="text"
            value={projectId}
            onChange={(e) =>
              e.target.value
                ? setProjectId(e.target.value)
                : setProjectId(undefined)
            }
            className="torque-h-10 torque-w-full torque-border torque-border-input torque-px-3 torque-py-2 focus-visible:torque-outline focus-visible:torque-ring-black torque-max-w-sm"
          />
        </div>
      ) : null}

      <div className="torque-mb-12">
        {isAuthenticated ? (
          <TorqueDrawer showButton={true} projectId={projectId} />
        ) : null}
      </div>

      {isAuthenticated && !currentUserLoading ? (
        <div className="torque-flex torque-flex-col torque-gap-1 torque-items-start">
          <h3 className="torque-text-lg torque-font-semibold torque-mb-2">
            Social Connections
          </h3>
          {currentUser?.connected.x ? (
            <div>
              Connected to Twitter as{" "}
              <span className="torque-font-semibold">
                @{currentUser.connected.x}
              </span>
            </div>
          ) : (
            <Button
              onClick={() => connect("twitter", "http://localhost:3002", true)}
            >
              Connect Twitter
            </Button>
          )}
        </div>
      ) : null}

      <TorqueConnectDialog />
    </div>
  );
}
