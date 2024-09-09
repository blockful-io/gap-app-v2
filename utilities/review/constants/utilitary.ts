import { isHex } from "viem";
import { Hex } from "viem";
import { registryHelper, ThemeMode } from "@/components/Pages/ProgramRegistry/helper";

export const addPrefixToIPFSLink = (link: string) => {
  if (link.startsWith("ipfs://")) {
    return link.replace("ipfs://", "https://ipfs.io/ipfs/");
  } else {
    return link;
  }
};

export function validateHex(potentialHex: string | Hex): Hex {
  if (isHex(potentialHex)) {
    return potentialHex as Hex;
  } else {
    throw new TypeError(`Invalid hex value: ${potentialHex}`);
  }
}

export function getNetworkImage(network: string) {
  return registryHelper.networkImages[network.toLowerCase()];
}
