import { TextField, Button } from "@mui/material";
import { useState, useEffect } from "react";
import { useMoralis } from "react-moralis";
import { abi, contractAddresses } from "../constants";

const X_API_KEY = process.env.NEXT_PUBLIC_X_API_KEY;

export default function Check() {
  const [address, setAddress] = useState("");
  const [helperText, setHelperText] = useState("");
  const [error, setError] = useState("");
  const [preventClick, setPreventClick] = useState(false);

  const { account, isWeb3EnableLoading, chainId: chainIdHex } = useMoralis();

  const chainId = parseInt(chainIdHex);
  const mintRingAddress =
    chainId in contractAddresses ? contractAddresses[chainId][0] : null;

  const getNFT = async (account) => {
    const response = await fetch(
      `https://deep-index.moralis.io/api/v2/${account}/nft?` +
        new URLSearchParams({
          chain: "goerli",
          format: "decimal",
          token_addresses: mintRingAddress,
          normalizeMetadata: "false",
        }),
      {
        method: "GET",
        headers: {
          accept: "application/json",
          "X-API-Key": X_API_KEY,
        },
        // headers: {
        //   "Content-Type": "application/json; charset=utf8",
        // },
      }
    );

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    return await response.json();
  };

  const handleCheck = async () => {
    setPreventClick(true);
    if (address.length != 42) {
      setError(true);
      setHelperText("Address is too short, Please check it!");
      return;
    }
    if (!address.startsWith("0x")) {
      setError(true);
      setHelperText("Wrong address");
      return;
    }
    if (account.toLowerCase() == address.toLowerCase()) {
      setError(true);
      setHelperText("Don't enter your current address!");
      return;
    }

    try {
      const data = await getNFT(address);
      if (!data.total) {
        setHelperText("Yes! He/She has no Partner!");
        return;
      }
      const nft = data.result[0];
      const metadataStr = nft.metadata;
      const metadata = JSON.parse(metadataStr);
      const attributes = metadata.attributes;
      const signers = attributes.map((element) => {
        return element.value;
      });

      const iamtheone = signers.includes(account?.toLowerCase());
      if (iamtheone) {
        setHelperText("Congratulations! You are his/her only one.");
        return;
      } else {
        setHelperText("OH BAD! He/she has the only one, but not you!");
        setError(error);
        setPreventClick(false);
      }
      return;
      // data.
    } catch (error) {
      setPreventClick(true);
      console.log(error);
    }
  };

  useEffect(() => {
    setPreventClick(false);
    setError(false);
    setHelperText("");
  }, [address, account]);

  return (
    <div className="w-screem h-screen flex flex-col justify-center items-center">
      <div className="text-[90px] font-[500] leading-[70px]">WHO IS</div>
      <div className="text-[90px] font-[500] leading-[70px]">THE ONLY?</div>
      <div className={"mt-[19px] text-[16px] font-[200] leading-[19px] italic"}>
        Please enter his/her address to check if you are the only.
      </div>
      <div className="my-[18px] w-[430px]">
        <TextField
          id="outlined-basic"
          fullWidth
          label="Address"
          variant="outlined"
          size="small"
          helperText={helperText}
          value={address}
          // disabled={signed}
          error={error}
          onChange={(e) => setAddress(e.target.value)}
        />
      </div>
      <div>
        <Button
          size="small"
          variant="outlined"
          disabled={preventClick}
          onClick={handleCheck}
        >
          CHECK
          {/* {signed ? "Signed" : "Sign"} */}
        </Button>
      </div>
    </div>
  );
}
