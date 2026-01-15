import { NextRequest, NextResponse } from 'next/server';

const MILADY_CONTRACT = '0x5Af0D9827E0c53E4799BB226655A1de152A425a5';
const OPENSEA_API_BASE = 'https://api.opensea.io/api/v2';

// Types for OpenSea API response
interface OpenSeaTrait {
  trait_type: string;
  value: string | number;
  display_type?: string;
}

interface OpenSeaNFT {
  identifier: string;
  collection: string;
  contract: string;
  token_standard: string;
  name: string;
  description: string;
  image_url: string;
  display_image_url: string;
  display_animation_url: string | null;
  metadata_url: string;
  opensea_url: string;
  updated_at: string;
  is_disabled: boolean;
  is_nsfw: boolean;
  traits: OpenSeaTrait[];
}

interface OpenSeaCollectionResponse {
  nfts: OpenSeaNFT[];
  next: string | null;
}

interface OpenSeaSingleNFTResponse {
  nft: OpenSeaNFT;
}

// GET /api/milady - Fetch collection NFTs
// GET /api/milady?id=1234 - Fetch single NFT by token ID
export async function GET(request: NextRequest) {
  const apiKey = process.env.OPENSEA_API_KEY;
  
  if (!apiKey) {
    return NextResponse.json(
      { error: 'OpenSea API key not configured' },
      { status: 500 }
    );
  }

  const searchParams = request.nextUrl.searchParams;
  const tokenId = searchParams.get('id');
  const limit = searchParams.get('limit') || '20';
  const next = searchParams.get('next'); // Pagination cursor

  try {
    if (tokenId) {
      // Fetch single NFT by token ID
      const response = await fetch(
        `${OPENSEA_API_BASE}/chain/ethereum/contract/${MILADY_CONTRACT}/nfts/${tokenId}`,
        {
          headers: {
            'X-API-KEY': apiKey,
            'Accept': 'application/json',
          },
          next: { revalidate: 3600 }, // Cache for 1 hour
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        return NextResponse.json(
          { error: `OpenSea API error: ${response.status}`, details: errorText },
          { status: response.status }
        );
      }

      const data: OpenSeaSingleNFTResponse = await response.json();
      
      return NextResponse.json({
        nft: transformNFT(data.nft),
      });
    } else {
      // Fetch collection NFTs
      let url = `${OPENSEA_API_BASE}/collection/milady/nfts?limit=${limit}`;
      if (next) {
        url += `&next=${next}`;
      }

      const response = await fetch(url, {
        headers: {
          'X-API-KEY': apiKey,
          'Accept': 'application/json',
        },
        next: { revalidate: 3600 }, // Cache for 1 hour
      });

      if (!response.ok) {
        const errorText = await response.text();
        return NextResponse.json(
          { error: `OpenSea API error: ${response.status}`, details: errorText },
          { status: response.status }
        );
      }

      const data: OpenSeaCollectionResponse = await response.json();
      
      return NextResponse.json({
        nfts: data.nfts.map(transformNFT),
        next: data.next,
        count: data.nfts.length,
      });
    }
  } catch (error) {
    console.error('Error fetching from OpenSea:', error);
    return NextResponse.json(
      { error: 'Failed to fetch NFT data', details: String(error) },
      { status: 500 }
    );
  }
}

// Transform OpenSea NFT to a cleaner format
function transformNFT(nft: OpenSeaNFT) {
  // Extract key traits
  const traits = nft.traits?.reduce((acc, trait) => {
    acc[trait.trait_type] = trait.value;
    return acc;
  }, {} as Record<string, string | number>) || {};

  return {
    id: nft.identifier,
    name: nft.name,
    image: nft.display_image_url || nft.image_url,
    thumbnail: nft.display_image_url || nft.image_url,
    opensea_url: nft.opensea_url,
    metadata_url: nft.metadata_url,
    traits: traits,
    // Key Milady traits
    drip_score: traits['Drip Score'],
    drip_grade: traits['Drip Grade'],
    core: traits['Core'],
    background: traits['Background'],
    hair: traits['Hair'],
    hat: traits['Hat'],
    shirt: traits['Shirt'],
    race: traits['Race'],
  };
}
