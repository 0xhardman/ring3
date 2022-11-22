import Image from "next/image";
import styles from "../styles/Home.module.css";

import Sign from "../components/Sign";
import Mint from "../components/Mint";
import { useState } from "react";

export default function Home() {
  const [a, setA] = useState(0);
  const [b, setB] = useState(0);
  return (
    <div>
      <Sign title={"Signer A"} setter={setA} />
      <Sign title={"Signer B"} setter={setB} />
      <Mint
        params={{
          toA: a.signer,
          signatureA: a.signature,
          toB: b.signer,
          signatureB: b.signature,
        }}
      />
    </div>
  );
}
