import React from "react";
import { useState } from "react";
import { ethers } from "ethers";
import TokenArtifact from "../constants/abi.json";
import { abi, contractAddresses } from "../constants";
import { useNotification } from "web3uikit";
import { useWeb3Contract, useMoralis } from "react-moralis";

export default function Mint(props) {
  const { chainId: chainIdHex, isWeb3Enabled } = useMoralis();
  const chainId = parseInt(chainIdHex);
  console.log(chainId);
  const mintRingAddress =
    chainId in contractAddresses ? contractAddresses[chainId][0] : null;
  const [state, setState] = useState("TRANSACT");
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
  const { runContractFunction: safeMintRingSync } = useWeb3Contract({
    contractAddress: mintRingAddress,
    abi: abi,
    functionName: "safeMintRingSync",
    params: {
      toA: props.params.toA,
      toB: props.params.toB,
      signatureA: props.params.signatureA,
      signatureB: props.params.signatureB,
    },
  });
  // will handle connection to web3 once clicked.
  // use in useEffect while in production
  const handleTransact = async () => {
    setState("gProvider..");
    await safeMintRingSync({
      onError: (error) => console.log(error),
      onSuccess: handleSuccess,
    });
    setState("finish");
  };
  return (
    <div>
      <h1>MINT</h1>
      <h3>toA: {props.params.toA}</h3>
      <h3>toB: {props.params.toB}</h3>
      <h3>signatureA: {props.params.signatureA}</h3>
      <h3>signatureB: {props.params.signatureB}</h3>
      <button onClick={handleTransact}>{state}</button>
    </div>
  );
}
