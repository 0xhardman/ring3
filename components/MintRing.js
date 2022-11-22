import { useEffect } from "react";
import { useWeb3Contract, useMoralis } from "react-moralis";
import { Chainlink } from "web3uikit";
import { abi, contractAddresses } from "../constants";
import { useNotification } from "web3uikit";

export default function MintRing() {
  const { chainId: chainIdHex, isWeb3Enabled } = useMoralis();
  const chainId = parseInt(chainIdHex);
  console.log({ chainId });
  const mintRingAddress =
    chainId in contractAddresses ? contractAddresses[chainId][0] : null;

  const dispatch = useNotification();
  const handleSuccess = async function (tx) {
    await tx.wait(1);
    handleNewNotification(tx);
  };
  const handleNewNotification = function () {
    dispatch({
      type: "info",
      message: "transaction Complete!",
      title: "Tx Notification",
      position: "topR",
      icon: "bell",
    });
  };

  const { runContractFunction: getEntranceFee } = useWeb3Contract({
    contractAddress: mintRingAddress,
    abi: abi,
    functionName: "getEntranceFee",
    params: {},
    msgValue: {},
  });
  // useEffect(() => {
  //   if (isWeb3Enabled) {
  //     const something = await getEntranceFee();
  //     console.log(something);
  //   }
  // }, []);
  // const { runContractFunction: enterRingMint } = useWeb3Contract({
  //   contractAddress: mintRingAddress,
  //   abi: abi,
  //   functionName: "mintRingFunction",
  //   params: {},
  //   msgValue: {},
  // });
  return <div></div>;
}
