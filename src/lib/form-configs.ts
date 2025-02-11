import { TX } from "./tx-prepper/tx";
import { TXLego } from "./tx-prepper/prepper-types";

export type FormConfig = {
  title?: string;
  description?: string;
  submitButtonText?: string;
  id: string;
  tx: TXLego;
  txToggle?: Record<string, TXLego>;
};

export const FORM_CONFIGS: Record<string, FormConfig> = {
  SAMPLE: {
    title: "Sampler Form",
    id: "SAMPLE",
    tx: TX.POST_SIGNAL,
  },
  POST_SIGNAL: {
    title: "Propose Signal",
    id: "POST_SIGNAL",
    tx: TX.POST_SIGNAL,
  },
  REQUEST_MEMBERSHIP: {
    title: "Request Membership",
    id: "REQUEST_MEMBERSHIP",
    tx: TX.REQUEST_MEMBERSHIP,
  },
  REQUEST_FUNDING: {
    title: "Request Fundung",
    id: "REQUEST_FUNDING",
    tx: TX.REQUEST_FUNDING,
    txToggle: {
      REQUEST_FUNDING: TX.REQUEST_FUNDING,
      REQUEST_FUNDING_ETH: TX.REQUEST_FUNDING_ETH,
    },
  },
};

export const validFormId = (id: string): boolean => {
  return Object.keys(FORM_CONFIGS).includes(id);
};
