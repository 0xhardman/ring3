export default function Footer() {
  return (
    <div className="w-screen flex justify-center">
      <div className="absolute flex bottom-[20px] w-[100px] justify-between">
        <a href="https://discord.gg/JaYGEp8kjZ" target="_blank">
          <img src="/svg/dc.svg" alt="dc" />
        </a>
        <a href="https://testnets.opensea.io/collection/ring3" target="_blank">
          <img src="/svg/opensea.svg" alt="opensea" />
        </a>

        <a href="https://twitter.com/ring3_official" target="_blank">
          <img src="/svg/twitter.svg" alt="twitter" />
        </a>
      </div>
    </div>
  );
}
