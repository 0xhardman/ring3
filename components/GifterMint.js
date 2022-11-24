import Web3 from "web3";
import { TextField, Button, Alert } from "@mui/material";
import { useState, useEffect } from "react";
import { abi, contractAddresses } from "../constants";
import { useWeb3Contract, useMoralis } from "react-moralis";
import { useNotification } from "web3uikit";

export default function GifterMint({ params, setSigned }) {
  const [minted, setMinted] = useState(false);
  const dispatch = useNotification();
  const { chainId: chainIdHex, isWeb3Enabled } = useMoralis();
  const chainId = parseInt(chainIdHex);
  const mintRingAddress =
    chainId in contractAddresses ? contractAddresses[chainId][0] : null;
  const {
    runContractFunction: safeMintRingSync,
    isLoading,
    isFetching,
  } = useWeb3Contract({
    contractAddress: mintRingAddress,
    abi: abi,
    functionName: "safeMintRingSync",
    params: params,
  });

  const handleSuccess = async (tx) => {
    await tx.wait(1);
    setMinted(true);
    setSigned(true);
  };
  const handleMint = async () => {
    await safeMintRingSync({
      onError: (error) => {
        console.log(error);
        dispatch({
          type: "error",
          message: error.data.message,
          title: error.code,
          position: "topR",
          // icon: "bell",
        });
      },
      onSuccess: handleSuccess,
    });
  };

  return (
    <div>
      <div
        className={
          "flex flex-col w-[180px] text-[64px] font-[200] leading-[64px]"
        }
      >
        Mint Your Ring3
      </div>
      <div className={"my-[18px] text-[16px] font-[200] leading-[19px] italic"}>
        A soul bound token will be minted to your and your partner's address.
      </div>
      <div>
        <Button
          size="small"
          variant="outlined"
          className="mt-[20px]"
          onClick={handleMint}
          disabled={minted || isFetching || isLoading}
        >
          {minted ? "minted" : "mint"}
        </Button>
      </div>
    </div>
  );
}
