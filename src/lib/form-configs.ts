// import { SignalShares } from "~/components/forms/SignalShares";
import { TX } from "./tx-prepper/tx";
import { TXLego } from "./tx-prepper/prepper-types";

export type FormConfig = {
  submitButtonText?: string;
  id: string;
  tx: TXLego;
};

export type FormValues = Record<string, string>;

export const FORM_CONFIGS: Record<string, FormConfig> = {
  SAMPLE: {
    id: "SAMPLE",
    tx: TX.POST_SIGNAL,
  },
  POST_SIGNAL: {
    id: "POST_SIGNAL",
    tx: TX.POST_SIGNAL,
  },
  REQUEST_MEMBERSHIP: {
    id: "REQUEST_MEMBERSHIP",
    tx: TX.REQUEST_MEMBERSHIP,
  },
};

export const validFormId = (id: string): boolean => {
  return Object.keys(FORM_CONFIGS).includes(id);
};
