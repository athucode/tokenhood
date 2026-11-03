/**
 * Public info about the $HOOD token, shown on the homepage and footer.
 * Edit these values when the token launches.
 */
export const HOOD_INFO = {
  name: "TokenHood",
  symbol: "HOOD",
  /** Contract address. Leave "0x..." until the token is live. */
  contractAddress: "0x......",
  chainName: "Robinhood",
  /** Platform that deployed the token. url is optional (leave "" to show plain text). */
  deployer: { name: "Ponsfamily", url: "https://ponsfamily.com/launchpad/" },
  x: { handle: "@token_HOOD", url: "https://x.com/@token_HOOD" },
  telegram: "",
};

export const isHoodLive = /^0x[0-9a-fA-F]{40}$/.test(HOOD_INFO.contractAddress);
