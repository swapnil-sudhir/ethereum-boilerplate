import { useMemo } from "react";
import { useMoralis } from "react-moralis";
import { useMoralisWeb3Api, useMoralisWeb3ApiCall } from "react-moralis";
import { useIPFS } from "./useIPFS";

export const useNFTTokenIds = (addr, limit = 20) => {
    const { token } = useMoralisWeb3Api();
    const { chainId } = useMoralis();
    const { resolveLink } = useIPFS();
    const getAllTokenIdsOpts = {
        chain: chainId,
        address: "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D",
        limit: limit,
    };

    const {
        fetch: getNFTTokenIds,
        data,
        error,
        isLoading,
        isFetching,
    } = useMoralisWeb3ApiCall(
        token.getAllTokenIds,
        getAllTokenIdsOpts,
        { autoFetch: !!token && addr !== "explore" },
    );

    const NFTTokenIds = useMemo(() => {
        if (!data?.result || !data?.result.length) {
            return data;
        }
        const formattedResult = data.result.map((nft) => {
            try {
                if (nft.metadata) {
                    const metadata = JSON.parse(nft.metadata);
                    const image = resolveLink(metadata?.image);
                    return { ...nft, image, metadata };
                }
            } catch (error) {
                return nft;
            }
            return nft;
        });

        return { ...data, result: formattedResult };
    }, [data]);

    return { getNFTTokenIds, data: NFTTokenIds, error, isLoading, isFetching };
};