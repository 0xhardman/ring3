import Web3 from "web3";
import { TextField, Button, Alert } from "@mui/material";
import { useState, useEffect } from "react";
import { abi, contractAddresses } from "../constants";
import { useWeb3Contract, useMoralis } from "react-moralis";
import { useNotification } from "web3uikit";

export default function CheckRing3({}) {
  return (
    <div>
      <div
        className={
          "flex flex-col w-[180px] text-[64px] font-[200] leading-[64px]"
        }
      >
        Check Your Ring3
      </div>
      <div className={"my-[18px] text-[16px] font-[200] leading-[19px] italic"}>
        Please check your Ring3 in opensea.
        <br />
        Welcome to join our{" "}
        <a href="https://discord.gg/JaYGEp8kjZ" className="font-[400]">
          discord
        </a>
        , and follow our{" "}
        <a href="https://twitter.com/ring3_official" className="font-[400]">
          twitter
        </a>
        .
      </div>
      <div></div>
    </div>
  );
}
