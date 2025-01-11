"use client";

import dynamic from "next/dynamic";

const ProposalForm = dynamic(
  () => import("../../../../../components/ProposalForm"),
  {
    ssr: false,
  }
);

export default function Proposal() {
  return <ProposalForm />;
}
