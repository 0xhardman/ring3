import React, { useState } from "react";
import Web3 from "web3";
export default function Sign({ title, setter }) {
  const [target, setTarget] = useState(
    "0x0000000000000000000000000000000000000000"
  );
  const [ecdsa, setEcdsa] = useState();

  const addRing3Record = async (ring3Record) => {
    const response = await fetch("/api/addRing3Record", {
      method: "POST",
      body: JSON.stringify(ring3Record),
      headers: {
        "Content-Type": "application/json; charset=utf8",
      },
    });

    console.log({ response });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    return await response.json();
  };
  async function signMessage(target) {
    if (!window.ethereum) return alert("Please Install Metamask");
    const ethereum = window.ethereum;
    // connect and get metamask account
    const accounts = await ethereum.request({
      method: "eth_requestAccounts",
    });

    // message to sign
    const message = target;

    // hash message
    const hashedMessage = Web3.utils.soliditySha3(message);

    // sign hashed message
    const signature = await ethereum.request({
      method: "personal_sign",
      params: [hashedMessage, accounts[0]],
    });
    console.log(
      "SIGNING:\n" +
        "\tsigning target " +
        target +
        " hashed message: " +
        hashedMessage +
        " signature: " +
        signature
    );
    const signer = accounts[0];
    // split signature
    const r = signature.slice(0, 66);
    const s = "0x" + signature.slice(66, 130);
    const v = parseInt(signature.slice(130, 132), 16);
    console.log({ r, s, v });
    setEcdsa({ r, s, v, signature, signer });
    setter({ signer: signer, signature: signature });
    const data = {
      gifterAdd: signer,
      recipientAdd: message,
      gifterSig: signature,
      recipientSig: "",
    };
    try {
      await addRing3Record(data);
    } catch (error) {
      console.log(error);
    }
  }

  const handleChange = (e) => {
    console.log(e.target.value);
    setTarget(e.target.value);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    signMessage(target);
  };
  return (
    <div>
      <div>{title}</div>
      <form onSubmit={handleSubmit}>
        <input placeholder="target addr" onChange={handleChange}></input>
        <button type="submit">Connect & Sign</button>
        {ecdsa && (
          <>
            <div>{`signer: ${ecdsa.signer}`}</div>
            <div>{`sig: ${ecdsa.signature}`}</div>
            <div>{`_v: ${ecdsa.v}`}</div>
            <div>{`_r: ${ecdsa.r}`}</div>
            <div>{`_s: ${ecdsa.s}`}</div>
          </>
        )}
      </form>
    </div>
  );
}
