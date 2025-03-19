import { RecordItem, YeeterItem, YeeterMetadata } from "./types";
import { fromWei } from "./helpers";
import { formatValueTo } from "./units";

export const calcProgressPerc = (a: string, b: string) => {
  let div = Number(a) / Number(b);

  if (div > 0 && div < 0.04) div = 0.04;
  return Number(div) * 100;
};

export const calcDurationPerc = (start: string, end: string) => {
  const now = new Date().getTime() / 1000;
  const yeetDuration = Number(end) - Number(start);
  const currentDuration = Number(end) - Number(now);
  const durationUsed = yeetDuration - currentDuration;

  return (durationUsed / yeetDuration) * 100;
};

export const calcYeetIsActive = (yeeter: YeeterItem) => {
  const now = new Date().getTime() / 1000;

  return Number(yeeter.startTime) < now && Number(yeeter.endTime) > now;
};

export const calcYeetIsEnded = (yeeter: YeeterItem) => {
  const now = new Date().getTime() / 1000;

  return Number(yeeter.endTime) < now;
};

export const calcYeetIsComingSoon = (yeeter: YeeterItem) => {
  const now = new Date().getTime() / 1000;

  return Number(yeeter.startTime) > now;
};

export const calcYeetIsFull = (yeeter: YeeterItem) => {
  return Number(yeeter.balance) >= Number(yeeter.goal);
};

export const formatMinContribution = (yeeter: YeeterItem) => {
  return formatValueTo({
    value: fromWei(yeeter.minTribute),
    decimals: 3,
    format: "number",
  });
};

export const formatLootForMin = (yeeter: YeeterItem) => {
  const loot = BigInt(yeeter.minTribute) * BigInt(yeeter.multiplier);
  return formatValueTo({
    value: fromWei(loot.toString()),
    decimals: 5,
    format: "number",
  });
};

export const formatLootForMinSimple = (
  minTribute: string,
  multiplier: string
) => {
  const loot = BigInt(minTribute) * BigInt(multiplier);
  return formatValueTo({
    value: fromWei(loot.toString()),
    decimals: 5,
    format: "number",
  });
};

export const formatLootForAmount = (yeeter: YeeterItem, amount: string) => {
  const loot = BigInt(amount) * BigInt(yeeter.multiplier);
  return formatValueTo({
    value: fromWei(loot.toString()),
    decimals: 5,
    format: "number",
  });
};

export const addParsedContent = <T>(record?: RecordItem): T | undefined => {
  if (record?.contentType === "json") {
    try {
      const obj = JSON.parse(record.content);

      return obj;
    } catch (e) {
      console.log("err", e);
      return;
    }
  }
};

export const addParsedLinks = (
  profile?: YeeterMetadata
): YeeterMetadata | undefined => {
  if (!profile) return;
  const links =
    profile.links &&
    (profile.links.map((linkObj: string) => {
      return typeof linkObj === "string" ? JSON.parse(linkObj) : {};
    }) as {
      url: string;
      label: string;
    }[]);
  return {
    ...profile,
    parsedLinks: links,
  };
};
