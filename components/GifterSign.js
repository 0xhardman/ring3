import Web3 from "web3";
import { TextField, Button } from "@mui/material";
import { useMoralis } from "react-moralis";
import { useState, useEffect } from "react";
export default function GifterSign({ signed, setSigned, signedAddress }) {
  const { account } = useMoralis();
  const [address, setAddress] = useState("");
  const [helperText, setHelperText] = useState("");
  const [error, seterror] = useState("");

  const addRing3Record = async (ring3Record) => {
    const response = await fetch("/api/addRing3Record", {
      method: "POST",
      body: JSON.stringify(ring3Record),
      headers: {
        "Content-Type": "application/json; charset=utf8",
      },
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    return await response.json();
  };

  const handleSign = async () => {
    if (!window.ethereum) return alert("Please Install Metamask");
    const ethereum = window.ethereum;
    // message to sign
    const message = address.toLowerCase();
    // hash message
    const hashedMessage = Web3.utils.soliditySha3(message);
    // sign hashed message
    const signer = account;
    const signature = await ethereum.request({
      method: "personal_sign",
      params: [hashedMessage, signer],
    });
    const data = {
      gifterAdd: signer,
      recipientAdd: message,
      gifterSig: signature,
      recipientSig: "",
    };
    try {
      await addRing3Record(data);
      setSigned(true);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (signedAddress) setAddress(signedAddress);
  }, [signedAddress]);
  useEffect(() => {
    console.log(account);
    if (!account) {
      return;
    }
    if (address.length != 42) {
      seterror(true);
      setHelperText("too short address");
      return;
    }
    if (!address.startsWith("0x")) {
      seterror(true);
      setHelperText("wrong address");
      return;
    }

    if (account.toLowerCase() == address.toLowerCase()) {
      seterror(true);
      setHelperText("the sign address can't be same as your partner address");
      return;
    } else {
      seterror(false);
      setHelperText("");
      return;
    }
  }, [address, account]);
  return (
    <div>
      <div
        className={
          "flex flex-col w-[180px] text-[64px] font-[200] leading-[64px]"
        }
      >
        Sign Your Partner
      </div>
      <div className={"mt-[19px] text-[16px] font-[200] leading-[19px] italic"}>
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
          helperText={helperText}
          value={address}
          disabled={signed}
          error={error}
          onChange={(e) => setAddress(e.target.value)}
        />
      </div>
      <div>
        <Button
          size="small"
          variant="outlined"
          disabled={signed || error}
          onClick={handleSign}
        >
          Sign
        </Button>
      </div>
    </div>
  );
}
