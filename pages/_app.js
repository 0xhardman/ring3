import "../styles/globals.css";
import Head from "next/head";
import { MoralisProvider } from "react-moralis";
import { NotificationProvider } from "web3uikit";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Header from "../components/Header";
import Footer from "../components/Footer";

function MyApp({ Component, pageProps }) {
  const theme = createTheme({
    palette: {
      primary: {
        // Purple and green play nicely together.
        main: "#000000",
      },
      secondary: {
        // This is green.A700 as hex.
        main: "#11cb5f",
      },
    },
  });
  return (
    <div className={"bg-[#F5F5F5] text-black h-screen"}>
      <Head>
        <title>Ring3</title>
        <meta
          name="description"
          content="SBT Ring, one man, one life, one ring"
        />
        <link rel="icon" href="favicon.ico" />
      </Head>
      <ThemeProvider theme={theme}>
        <MoralisProvider initializeOnMount={false}>
          <NotificationProvider>
            <Header></Header>
            <Component {...pageProps} />
            <Footer></Footer>
          </NotificationProvider>
        </MoralisProvider>
      </ThemeProvider>
    </div>
  );
}

export default MyApp;
