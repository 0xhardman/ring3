import Web3 from "web3";
import { TextField, Button } from "@mui/material";
import { useMoralis } from "react-moralis";
import { useState, useEffect } from "react";
export default function RecipientSign({ signed, setSigned, signedAddress }) {
  const { account } = useMoralis();
  const [address, setAddress] = useState("");
  const [helperText, setHelperText] = useState("");
  const [error, seterror] = useState("");
  const [preventClick, setPreventClick] = useState(false);

  const acceptRing = async (ring3Record) => {
    const response = await fetch("/api/acceptRing", {
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
    setPreventClick(true);
    if (!window.ethereum) return alert("Please Install Metamask");
    const ethereum = window.ethereum;
    // message to sign
    const message = address.toLowerCase();
    // hash message
    const hashedMessage = Web3.utils.soliditySha3(message);
    // sign hashed message
    const signer = account?.toLowerCase();

    try {
      const signature = await ethereum.request({
        method: "personal_sign",
        params: [hashedMessage, signer],
      });
      const data = {
        recipientAdd: signer,
        recipientSig: signature,
      };
      await acceptRing(data);
      setSigned(true);
    } catch (error) {
      console.log(error);
      setPreventClick(false);
    }
  };
  useEffect(() => {
    if (signedAddress) setAddress(signedAddress);
  }, [signedAddress]);
  return (
    <div>
      <div
        className={
          "flex flex-col w-[180px] text-[64px] font-[200] leading-[64px]"
        }
      >
        Accept the Partner
      </div>
      <div className={"mt-[19px] text-[16px] font-[200] leading-[19px] italic"}>
        Accept your Partner's invite!
      </div>
      <div className="my-[18px] w-[430px]">
        <TextField
          id="outlined-basic"
          fullWidth
          label="Your Partner Address"
          variant="outlined"
          size="small"
          helperText={helperText}
          value={address}
          disabled={true}
          error={error}
          onChange={(e) => setAddress(e.target.value)}
        />
      </div>
      <div>
        <Button
          size="small"
          variant="outlined"
          disabled={signed || error || preventClick}
          onClick={handleSign}
        >
          Sign
        </Button>
      </div>
    </div>
  );
}
