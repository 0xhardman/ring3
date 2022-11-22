import "../styles/globals.css";
import Head from "next/head";
import { MoralisProvider } from "react-moralis";
import { NotificationProvider } from "web3uikit";
import Header from "../components/Header";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Ring3</title>
        <meta
          name="description"
          content="SBT Ring, one man, one life, one ring"
        />
        <link rel="icon" href="favicon.ico" />
      </Head>
      <MoralisProvider initializeOnMount={false}>
        <NotificationProvider>
          <Header></Header>
          <Component {...pageProps} />
        </NotificationProvider>
      </MoralisProvider>
    </>
  );
}

export default MyApp;
