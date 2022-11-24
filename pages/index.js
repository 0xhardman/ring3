import Image from "next/image";
import styles from "../styles/Home.module.css";
import clsx from "clsx";

import Sign from "../components/Sign";
import Mint from "../components/Mint";
import GifterSign from "../components/GifterSign";
import RecipientSign from "../components/RecipientSign";
import GifterMint from "../components/GifterMint";
import { useEffect, useState } from "react";
import { TextField, Button } from "@mui/material";
import { useMoralis } from "react-moralis";

export default function Home() {
  const { account, isWeb3EnableLoading } = useMoralis();

  //0:loading 1:gifter sign 2:recipient sign  3:sync mint 4:check ring3
  const [active, setActive] = useState(0);
  const [signed, setSigned] = useState(false);
  const [mintParams, setMintParams] = useState({});
  const [signedAddress, setSignedAddress] = useState("");

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
          setActive(3);
          setSigned(true);
          setMintParams({
            toA: gifterRecord.gifterAdd,
            toB: gifterRecord.recipientAdd,
            signatureA: gifterRecord.gifterSig,
            signatureB: gifterRecord.recipientSig,
          });
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
          setActive(2);
          setSigned(true);
          setSignedAddress(recipientRecord.gifterAdd);
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
  }, [account]);
  return (
    <div className={"h-screen w-screen flex justify-center items-center "}>
      <div className={"flex items-center h-[480px] "}>
        <div className="mr-[120px] ">
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
        {active == 3 && <GifterMint params={mintParams} />}
      </div>
      {active != 0 && (
        <>
          <div className="absolute flex justify-center border-t-[3px] border-black border-dashed w-screen bg-blue bottom-[100px] px-[10px]">
            <div className="w-[50%] flex justify-between ">
              <p
                className={clsx(
                  active == 1 ? " text-black" : "text-gray-400",
                  "italic"
                )}
              >
                Sign
              </p>
              <p
                className={clsx(
                  active == 2 ? " text-black" : "text-gray-400",
                  "italic"
                )}
              >
                PartnerSign
              </p>
              <p
                className={clsx(
                  active == 3 ? " text-black" : "text-gray-400",
                  "italic"
                )}
              >
                SyncMint
              </p>
              <p
                className={clsx(
                  active == 4 ? " text-black" : "text-gray-400",
                  "italic"
                )}
              >
                Ring3
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
