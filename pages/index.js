import Image from "next/image";
import styles from "../styles/Home.module.css";

import Sign from "../components/Sign";
import Mint from "../components/Mint";
import { useState } from "react";
// import { Button, fonts } from "web3uikit";
import { TextField, Button } from "@mui/material";

export default function Home() {
  const [a, setA] = useState(0);
  const [b, setB] = useState(0);
  return (
    <div className={"h-screen w-screen flex justify-center items-center "}>
      <div className={"flex items-center h-[480px] "}>
        <div className="mr-[220px]">
          <img src="/svg/ring.svg" alt="An SVG of an eye" />
        </div>
        <div>
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
            {/* <input></input> */}
          </div>
          <div>
            <Button size="small" variant="outlined">
              Confirm
            </Button>
          </div>
        </div>

        {/*
         
        <Sign title={"Signer A"} setter={setA} />
        <Sign title={"Signer B"} setter={setB} />
        <Mint
          params={{
            toA: a.signer,
            signatureA: a.signature,
            toB: b.signer,
            signatureB: b.signature,
          }}
        /> */}
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
