export default function Footer() {
  return (
    <div className="w-screen flex justify-center">
      <div className="absolute flex bottom-[20px] w-[100px] justify-between">
        <a href="https://discord.gg/JaYGEp8kjZ">
          <img src="/svg/dc.svg" alt="dc" />
        </a>
        <a href="https://opensea.io/">
          <img src="/svg/opensea.svg" alt="opensea" />
        </a>

        <a
          className="pointer-events-auto"
          href="https://twitter.com/ring3_official"
        >
          <img src="/svg/twitter.svg" alt="twitter" />
        </a>
      </div>
    </div>
  );
}
