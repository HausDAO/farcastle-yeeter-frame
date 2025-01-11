"use client";

import dynamic from "next/dynamic";

const DaoProposalList = dynamic(
  () => import("../../../../components/ProposalList"),
  {
    ssr: false,
  }
);

export default function Dao() {
  return <DaoProposalList />;
}
