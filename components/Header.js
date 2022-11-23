import { useMoralis } from "react-moralis";
import { ConnectButton } from "web3uikit";
import { useEffect } from "react";

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
        <div>Ring3 logo</div>
        <ConnectButton moralisAuth={false} />
        {/* {account ? (
          <button>{account}</button>
        ) : (
          <button
            onClick={async () => {
              await enableWeb3();
              if (typeof window !== "undefined") {
                window.localStorage.setItem("connected", "injected");
              }
            }}
            disabled={isWeb3EnableLoading}
          >
            connect
          </button>
        )} */}
      </div>
    </nav>
  );
}
