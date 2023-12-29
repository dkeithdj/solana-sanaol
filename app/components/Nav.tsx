"use client";
import dynamic from "next/dynamic";
import React from "react";

const Nav = () => {
  const ReactWalletMultiButton = dynamic(
    async () =>
      (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
    { ssr: false }
  );
  return (
    <div className="flex justify-between items-center bg-purple-200 px-24 py-4">
      <div>Sanaol</div>
      <div>
        <ReactWalletMultiButton />
      </div>
    </div>
  );
};

export default Nav;
