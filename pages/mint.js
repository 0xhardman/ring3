import Image from "next/image";
import styles from "../styles/Home.module.css";
import clsx from "clsx";
import GifterSign from "../components/GifterSign";
import RecipientSign from "../components/RecipientSign";
import GifterMint from "../components/GifterMint";
import CheckRing3 from "../components/CheckRing3";
import { useEffect, useState } from "react";
import { TextField, Button } from "@mui/material";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { abi, contractAddresses } from "../constants";

export default function Mint() {
  const { account, isWeb3EnableLoading, chainId: chainIdHex } = useMoralis();

  //0:loading 1:gifter sign 2:recipient sign  3:sync mint 4:check ring3
  const [active, setActive] = useState(0);
  const [signed, setSigned] = useState(false);
  const [mintParams, setMintParams] = useState({});
  const [signedAddress, setSignedAddress] = useState("");

  const chainId = parseInt(chainIdHex);
  const mintRingAddress =
    chainId in contractAddresses ? contractAddresses[chainId][0] : null;

  //chain reader
  const { data, error, runContractFunction, isFetching, isLoading } =
    useWeb3Contract();

  // api getter
  const getGifterRecord = async (gifterAdd) => {
    const response = await fetch(
      `/api/getGifterRecord?gifterAdd=${gifterAdd}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json; charset=utf8",
        },
      }
    );

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    return await response.json();
  };
  const getRecipientRecord = async (recipientAdd) => {
    const response = await fetch(
      `/api/getRecipientRecord?recipientAdd=${recipientAdd}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json; charset=utf8",
        },
      }
    );

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    return await response.json();
  };

  const checkUser = async () => {
    try {
      setActive(0);
      //warn: a record
      const gifterRecord = await getGifterRecord(account);
      const recipientRecords = await getRecipientRecord(account);
      const recipientRecord = recipientRecords[0];
      if (!gifterRecord && !recipientRecord) {
        setActive(1);
        setSigned(false);
        return;
      }
      if (gifterRecord) {
        if (!gifterRecord.recipientSig) {
          setActive(1);
          setSigned(true);
          setSignedAddress(gifterRecord.recipientAdd);
          return;
        } else {
          const tokenId = await runContractFunction({
            params: {
              contractAddress: mintRingAddress,
              abi: abi,
              functionName: "tokenOfOwnerByIndex",
              params: { owner: account, index: 0 },
            },
            onError: (error) => {
              console.log(error);
            },
          });
          console.log({ tokenId });
          console.log(!tokenId);
          if (!tokenId) {
            setMintParams({
              toA: gifterRecord.gifterAdd,
              toB: gifterRecord.recipientAdd,
              signatureA: gifterRecord.gifterSig,
              signatureB: gifterRecord.recipientSig,
            });
            setActive(3);
            console.log(active);
          } else {
            const uri = await runContractFunction({
              params: {
                contractAddress: mintRingAddress,
                abi: abi,
                functionName: "tokenURI",
                params: { tokenId: tokenId },
              },
              onError: (error) => console.log(error),
            });
            console.log({ uri });
            setActive(4);
          }
          return;
        }
      }
      if (recipientRecord) {
        if (!recipientRecord.recipientSig) {
          setActive(2);
          setSigned(false);
          setSignedAddress(recipientRecord.gifterAdd);
          return;
        } else {
          const tokenId = await runContractFunction({
            params: {
              contractAddress: mintRingAddress,
              abi: abi,
              functionName: "tokenOfOwnerByIndex",
              params: { owner: account, index: 0 },
            },
            onError: (error) => {
              console.log(error);
            },
          });
          console.log({ tokenId });
          console.log(!tokenId);
          if (!tokenId) {
            setActive(2);
            setSigned(true);
            setSignedAddress(recipientRecord.gifterAdd);
          } else {
            const uri = await runContractFunction({
              params: {
                contractAddress: mintRingAddress,
                abi: abi,
                functionName: "tokenURI",
                params: { tokenId: tokenId },
              },
              onError: (error) => console.log(error),
            });
            console.log({ uri });
            setActive(4);
          }
          return;
        }
      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    if (!account) return;
    checkUser();
    console.log(active);
  }, [account, signed]);
  return (
    <div className={"h-screen w-screen flex justify-center items-center "}>
      <div className={"flex items-center h-[480px] "}>
        <div className={clsx(active && "mr-[40px]")}>
          <img src="/svg/ring.svg" alt="An SVG of an eye" />
          {active == 0 && (
            <p className="text-center text-2xl font-semibold italic">
              Loading...
            </p>
          )}
        </div>
        {active == 0 && <></>}
        {active == 1 && (
          <GifterSign
            signed={signed}
            setSigned={setSigned}
            signedAddress={signedAddress}
          />
        )}
        {active == 2 && (
          <RecipientSign
            signed={signed}
            setSigned={setSigned}
            signedAddress={signedAddress}
          />
        )}
        {active == 3 && (
          <GifterMint params={mintParams} setSigned={setSigned} />
        )}
        {active == 4 && <CheckRing3 />}
      </div>
      {active != 0 && (
        <>
          <div className="absolute flex justify-center w-screen bg-blue bottom-[100px] px-[10px] bigline">
            <div className="w-[50%] flex justify-between ">
              <p
                className={clsx(
                  active == 1 ? " text-black" : "text-gray-400",
                  "italic"
                )}
              >
                GifterSign
              </p>
              <p
                className={clsx(
                  active == 2 ? " text-black" : "text-gray-400",
                  "italic"
                )}
              >
                RecipientSign
              </p>
              <p
                className={clsx(
                  active == 3 ? " text-black" : "text-gray-400",
                  "italic"
                )}
              >
                GifterMint
              </p>
              <p
                className={clsx(
                  active == 4 ? " text-black" : "text-gray-400",
                  "italic"
                )}
              >
                CheckRing3
              </p>
            </div>
          </div>
        </>
      )}
      <div className="absolute flex text-[250px] font-[800] top-[0px] right-[0] opacity-10 pointer-events-none">
        Ring3
      </div>
    </div>
  );
}
