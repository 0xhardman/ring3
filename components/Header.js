import { useMoralis } from "react-moralis";
import { ConnectButton } from "web3uikit";
import { useEffect } from "react";
import Link from "next/link";

export default function Home() {
  const {
    enableWeb3,
    account,
    isWeb3Enabled,
    Moralis,
    deactivateWeb3,
    isWeb3EnableLoading,
  } = useMoralis();

  useEffect(() => {
    if (isWeb3Enabled) return;
    if (typeof window !== "undefined") {
      if (window.localStorage.getItem("connected")) {
        enableWeb3();
      }
    }
  }, [isWeb3Enabled]);

  useEffect(() => {
    Moralis.onAccountChanged((account) => {
      console.log(`Account changed to ${account}`);
      if (account == null) {
        window.localStorage.removeItem("connected");
        deactivateWeb3();
        console.log("Null account found");
      }
    });
  }, []);

  return (
    <nav className="absolute top-0 w-full">
      <div className="flex justify-between pt-[40px] px-[50px] m-[1px]">
        {/* <ConnectButton moralisAuth={false} className="bg-black" /> */}
        <div className="flex">
          <div>
            <img
              className="h-[40px]"
              src="https://s1.ax1x.com/2022/11/25/zJ79fg.png"
              alt="Ring3"
            />
          </div>
          <Link
            href={"/"}
            className=" text-white bg-black text-[20px] leading-[40px] px-4 transform-gpu -skew-x-[10deg] mx-5"
          >
            Intro
          </Link>
          <Link
            href={"/mint"}
            className=" text-white bg-black text-[20px] leading-[40px] px-4 transform-gpu -skew-x-[10deg] mx-5"
          >
            Mint
          </Link>
          <Link
            href={"/check"}
            className=" text-white bg-black text-[20px] leading-[40px] px-4 transform-gpu -skew-x-[10deg] mx-5"
          >
            Check
          </Link>
        </div>
        {account ? (
          <div className="bg-[#aaa] px-3 rounded-full leading-9 ">
            {account.slice(0, 5) + "..." + account.slice(-5)}
          </div>
        ) : (
          <button
            className="bg-[#aaa] px-3 rounded-full"
            onClick={async () => {
              await enableWeb3();
              if (typeof window !== "undefined") {
                window.localStorage.setItem("connected", "injected");
              }
            }}
            disabled={isWeb3EnableLoading}
          >
            Connect
          </button>
        )}
      </div>
    </nav>
  );
}
