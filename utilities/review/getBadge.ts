import { readContract } from "viem/actions";
import { createPublicClient, http } from "viem";
import { arbitrum } from "viem/chains";
import { BADGE_REGISTRY } from "./constants/constants";
import { BADGE_REGISTRY_ABI } from "./constants/abi";
export interface BadgeOfficial {
  // TODO: Refactor this name to use Badge instead of BadgeOffical. Only used for now to don't crash the application with the used name 'Badge' for the mocks
  name: string;
  description: string;
  metadata: string; // Image IPFS
  data: string;
}

const publicClient = createPublicClient({
  chain: arbitrum,
  transport: http(),
});

//Test
function toBytes32(hexString: string): string {
  if (hexString.startsWith("0x")) {
    hexString = hexString.slice(2);
  }

  if (hexString.length > 64) {
    throw new Error("Hex string is too long to be converted to bytes32");
  }

  while (hexString.length < 64) {
    hexString = "0" + hexString;
  }

  return "0x" + hexString;
}

/**
 * Retrieves a badge by its ID.
 *
 * @param badgeId - The ID of the badge to retrieve. Should be in Bytes32.
 * @returns A promise that resolves to the retrieved badge.
 * @throws If there is an error when reading the contract.
 */
export async function getBadge(badgeId: string): Promise<BadgeOfficial> {
  try {
    const badgeData = await readContract(publicClient, {
      address: BADGE_REGISTRY,
      functionName: "getBadge",
      abi: BADGE_REGISTRY_ABI,
      args: [badgeId],
    });

    return badgeData as BadgeOfficial;
  } catch (error) {
    console.log("Error when reading the contract", error);
    throw new Error("Error when reading the contract");
  }
}
