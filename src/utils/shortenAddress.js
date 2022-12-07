export const shortenAddress = (addr) => {
  const first = addr.slice(0, 6);
  const last = addr.slice(addr.length - 4);

  return `${first}...${last}`;
};
