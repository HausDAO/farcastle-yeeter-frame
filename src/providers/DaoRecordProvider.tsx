"use client";

import { useParams } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import { getLocalDaoConfig, WAGMI_CHAIN_OBJS } from "@/lib/constants";
import { useDao } from "@/hooks/useDao";

interface DaoRecordContextValue {
  daoid?: string;
  daosafe?: string;
  daochain?: string;
  daochainid?: number;
}

const DaoRecordContext = createContext<DaoRecordContextValue | undefined>(
  undefined
);

export function DaoRecordProvider({ children }: { children: React.ReactNode }) {
  const [daoid, setDaoid] = useState<string | undefined>();
  const [daochain, setDaochain] = useState<string | undefined>();
  const [daochainid, setDaochainid] = useState<number | undefined>();
  const [daosafe, setsafe] = useState<string | undefined>();

  const { dao } = useDao({
    chainid: daochain,
    daoid,
  });

  const params = useParams<{ chainid: string; daoid: string }>();

  useEffect(() => {
    const localDaoConfig = getLocalDaoConfig();
    setDaoid(params.daoid || localDaoConfig?.DAO_ID);
    setDaochain(params.chainid || localDaoConfig?.DAO_CHAIN);
    setDaochainid(
      WAGMI_CHAIN_OBJS[params.chainid]?.id || localDaoConfig?.DAO_CHAIN_ID
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  useEffect(() => {
    if (dao) {
      setsafe(dao.safeAddress);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dao]);

  return (
    <DaoRecordContext.Provider value={{ daoid, daosafe, daochain, daochainid }}>
      {children}
    </DaoRecordContext.Provider>
  );
}

export const useDaoRecord = () => {
  const context = useContext(DaoRecordContext);

  return {
    daoid: context?.daoid,
    daosafe: context?.daosafe,
    daochain: context?.daochain,
    daochainid: context?.daochainid,
  };
};
