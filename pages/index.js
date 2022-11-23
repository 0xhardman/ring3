import Image from "next/image";
import styles from "../styles/Home.module.css";

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
  //0:gifter sign 1:recipient sign  2:sync mint 3:check ring3
  const [active, setActive] = useState(0);
  const [signed, setSigned] = useState(false);
  const [mintParams, setMintParams] = useState({});
  const [signedAddress, setSignedAddress] = useState("");
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
      //warn: a record
      const gifterRecord = await getGifterRecord(account);
      const recipientRecords = await getRecipientRecord(account);
      const recipientRecord = recipientRecords[0];
      if (!gifterRecord && !recipientRecord) {
        setActive(0);
        setSigned(false);
        return;
      }
      if (gifterRecord) {
        if (!gifterRecord.recipientSig) {
          setActive(0);
          setSigned(true);
          setSignedAddress(gifterRecord.recipientAdd);
          return;
        } else {
          setActive(2);
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
          setActive(1);
          setSigned(false);
          setSignedAddress(recipientRecord.gifterAdd);
          return;
        } else {
          setActive(1);
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
        <div className="mr-[120px]">
          <img src="/svg/ring.svg" alt="An SVG of an eye" />
        </div>
        {/* <div>
          <div
            className={
              "flex flex-col w-[180px]  text-[64px] font-[200] leading-[64px]"
            }
          >
            Sign Your Partner
          </div>
          <div
            className={"mt-[19px] text-[16px] font-[200] leading-[19px] italic"}
          >
            make a vow to your parter whose address being the vow content.
          </div>
          <div>
            <TextField
              id="outlined-basic"
              fullWidth
              label="Partner Address"
              variant="outlined"
              className="my-[18px]"
              size="small"
            />
          </div>
          <div>
            <Button size="small" variant="outlined">
              Confirm
            </Button>
          </div>
        </div> */}
        {active == 0 && (
          <GifterSign
            signed={signed}
            setSigned={setSigned}
            signedAddress={signedAddress}
          />
        )}
        {active == 1 && (
          <RecipientSign
            signed={signed}
            setSigned={setSigned}
            signedAddress={signedAddress}
          />
        )}
        {active == 2 && <GifterMint params={mintParams} />}
      </div>
      {/* todo:componentlize  */}
      <div className="absolute flex justify-center border-t-[3px] border-black border-dashed w-screen bg-blue bottom-[100px] px-[10px]">
        <div className="w-[50%] flex justify-between">
          <div>Sign</div>
          <div>PartnerSign</div>
          <div>SyncMint</div>
          <div>Ring3</div>
        </div>
      </div>
    </div>
  );
}
