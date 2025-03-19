import { Chain, formatEther, formatUnits } from "viem";

export const nowInSeconds = (): number => new Date().getTime() / 1000;

export const parseContent = (content: string | undefined) => {
  if (content) {
    try {
      return JSON.parse(content);
    } catch (e) {
      console.log("err", e);
      return;
    }
  }
};

export const truncateAddress = (addr: string) =>
  `${addr.slice(0, 6)}...${addr.slice(-4)}`;
export const charLimit = (str: string | undefined, limit: number) =>
  str && str.length > limit ? `${str.slice(0, limit)}...` : str;
export const fromWei = (amt: string): string => {
  return formatEther(BigInt(amt)).toString();
};
export const toBigInt = (
  amt?: string | number | boolean | bigint
): bigint | undefined => {
  if (amt) {
    return BigInt(amt as string | number | boolean | bigint);
  }
};
export const isJSON = (obj: unknown) => {
  try {
    JSON.parse(obj as string);
    return true;
  } catch (e) {
    console.log("parse error", e);
    return false;
  }
};
export const toWholeUnits = (amount: string, decimals = 18) =>
  formatUnits(BigInt(amount), decimals).toString();

export const getNonce = (length = 24) => {
  let text = "";
  const possible = "0123456789";
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

export const memberTokenBalanceShare = (
  tokenBalance: string | number,
  daoTotalShares: string | number,
  daoTotalLoot: string | number,
  memberShares: string | number,
  memberLoot: string | number,
  decimals: string | number = 18
): number => {
  const daoSharesAndLoot =
    Number(formatEther(BigInt(daoTotalShares))) +
    Number(formatEther(BigInt(daoTotalLoot)));
  const sharesAndLoot =
    Number(formatEther(BigInt(memberShares))) +
    Number(formatEther(BigInt(memberLoot)));

  const ratio = sharesAndLoot / daoSharesAndLoot;

  const memberSharesWei = Number(tokenBalance) * ratio;
  return memberSharesWei / 10 ** Number(decimals);
};

export const nativeCurrencySymbol = (chain: Chain | undefined) => {
  return chain?.nativeCurrency.symbol || "ETH";
};
