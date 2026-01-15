// Milady NFT types and utilities

export interface MiladyNFT {
  id: string;
  name: string;
  image: string;
  thumbnail: string;
  opensea_url: string;
  metadata_url: string;
  traits: Record<string, string | number>;
  drip_score?: number;
  drip_grade?: string;
  core?: string;
  background?: string;
  hair?: string;
  hat?: string;
  shirt?: string;
  race?: string;
}

export interface MiladyCollectionResponse {
  nfts: MiladyNFT[];
  next: string | null;
  count: number;
}

export interface MiladySingleResponse {
  nft: MiladyNFT;
}

// Fetch Milady collection from our API
export async function fetchMiladyCollection(
  limit: number = 20,
  next?: string
): Promise<MiladyCollectionResponse> {
  let url = `/api/milady?limit=${limit}`;
  if (next) {
    url += `&next=${encodeURIComponent(next)}`;
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch Milady collection: ${response.status}`);
  }

  return response.json();
}

// Fetch single Milady by token ID
export async function fetchMiladyById(tokenId: string): Promise<MiladySingleResponse> {
  const response = await fetch(`/api/milady?id=${tokenId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch Milady #${tokenId}: ${response.status}`);
  }

  return response.json();
}

// Curated list of notable Miladys for the lookbook
export const FEATURED_MILADYS = [
  '1', '100', '420', '777', '1337', '2222', '3333', '4444', '5555', '6969'
];

// Fetch featured Miladys for editorial display
export async function fetchFeaturedMiladys(): Promise<MiladyNFT[]> {
  const results = await Promise.allSettled(
    FEATURED_MILADYS.map(id => fetchMiladyById(id))
  );

  return results
    .filter((r): r is PromiseFulfilledResult<MiladySingleResponse> => r.status === 'fulfilled')
    .map(r => r.value.nft);
}
