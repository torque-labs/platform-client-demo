import { Wallet } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { useOffers, useTorque, useCurrentUser } from "@torque-labs/react";
import { OfferResponse } from "@torque-labs/sdk";

import { Button } from "#/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "#/components/ui/drawer";
import Logo from "#components/Logo";
import { OfferListItem } from "./OfferListItem";
import { OfferDetails } from "./OfferDetails";

import { cn } from "#/lib/utils";

interface TorqueDrawerProps {
  /**
   * Project ID to fetch offers for
   */
  projectId?: string;

  /**
   * Additional class names to apply to the button which opens the drawer
   */
  buttonClassName?: string;

  /**
   * The label of the button which opens the drawer
   */
  buttonLabel?: string;

  /**
   * Whether the drawer is open
   */
  open?: boolean;

  /**
   * Whether to show the button to open the drawer (default: false)
   */
  showButton?: boolean;

  /**
   * On open change callback
   */
  onOpenChange?: (open: boolean) => void;
}

/**
 * Display the offers and journeys for the current user in a drawer.
 */
export function TorqueDrawer({
  projectId,
  buttonClassName,
  buttonLabel,
  open,
  showButton = false,
  onOpenChange,
}: TorqueDrawerProps) {
  const [isOpen, setIsOpen] = useState(open);
  const [openOffer, setOpenOffer] = useState<OfferResponse | undefined>(
    undefined
  );

  const { torque } = useTorque();

  const { data: offers } = useOffers({
    projectId: projectId,
    status: "ACTIVE",
  });

  const { data: user } = useCurrentUser();

  const publicKey = useMemo(() => user?.publicKey, [user?.publicKey]);

  /**
   * Set isOpen state when open prop changes
   */
  useEffect(() => {
    setIsOpen(open);
  }, [open]);

  return (
    <Drawer
      direction="right"
      onClose={() => {
        // setOpenOffer(undefined);
      }}
      onOpenChange={(val) => {
        setIsOpen(val);

        if (onOpenChange) {
          onOpenChange(val);
        }
      }}
      open={isOpen}
    >
      {showButton ? (
        <DrawerTrigger asChild>
          <Button className={cn(buttonClassName)} variant="secondary">
            {buttonLabel ? buttonLabel : "Open Drawer"}
          </Button>
        </DrawerTrigger>
      ) : null}

      <DrawerContent className="torque-bottom-0 torque-left-auto torque-right-0 torque-top-0 torque-mt-0 torque-flex torque-w-96 torque-overflow-auto torque-rounded-none torque-bg-card torque-text-white torque-outline-none torque-overflow-x-hidden">
        <DrawerHeader className="!torque-flex torque-items-center torque-justify-between torque-gap-2 torque-p-4 torque-pt-6">
          <DrawerTitle className="torque-flex torque-items-center torque-gap-2 torque-rounded-md torque-border torque-border-white/20 torque-px-2.5 torque-py-1 torque-text-sm torque-font-normal">
            <Wallet className="torque-text-muted-foreground" size={16} />
            {publicKey ? (
              <div>{`${publicKey.toString().slice(0, 4)}....${publicKey
                .toString()
                .slice(-4)}`}</div>
            ) : null}
          </DrawerTitle>
          <DrawerDescription className="torque-flex torque-items-center torque-gap-2 !torque-text-[10px]">
            Powered by <Logo className="torque-w-20" />
          </DrawerDescription>
        </DrawerHeader>

        {!openOffer ? (
          <div className="torque-flex torque-w-full torque-flex-col torque-gap-4 torque-p-4">
            <h3 className="torque-text-lg torque-font-medium">
              Offers ({offers?.length ? offers.length : 0})
            </h3>
            {offers?.map((campaign) => {
              return (
                <OfferListItem
                  key={`offer-list-item-${campaign.id}`}
                  offer={campaign}
                  onClick={() => {
                    setOpenOffer(campaign);
                  }}
                />
              );
            })}
          </div>
        ) : (
          <OfferDetails
            offer={openOffer}
            onClose={() => {
              setOpenOffer(undefined);
            }}
          />
        )}

        <DrawerFooter className="torque-sticky torque-bottom-0 torque-left-0 torque-flex torque-w-full torque-items-center torque-justify-center torque-bg-gradient-to-t torque-from-card torque-from-50% torque-to-100% torque-pt-10">
          <DrawerClose asChild>
            <Button className="torque-w-full" variant="outline">
              Close
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
