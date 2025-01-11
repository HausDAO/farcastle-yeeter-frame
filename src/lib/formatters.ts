export const truncateAddress = (address: string) => {
  if (!address) return "";
  return `${address.slice(0, 5)}...${address.slice(-4)}`;
};

//remove
const MIN_SCORE_FORMATTER_TARGET = 1e3 / 2;

function formatScore({ score }: { score: number }) {
  return score < MIN_SCORE_FORMATTER_TARGET
    ? `< ${MIN_SCORE_FORMATTER_TARGET.toLocaleString()}`
    : score.toLocaleString();
}

export { formatScore };
