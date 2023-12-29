"use client";
import Image from "next/image";
import idl from "@/public/solana_sanaol.json";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { Connection, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { AnchorProvider, Idl, Program } from "@coral-xyz/anchor";

export default function Home() {
  const anchorWallet = useAnchorWallet();
  // if (!anchorWallet) return null;
  // const network = "http://127.0.0.1:8899";
  // const devnet = "https://api.devnet.solana.com";
  // const connection = new Connection(network, "processed");
  // connection.getBalance(anchorWallet.publicKey).then((balance) => {
  //   console.log(balance / LAMPORTS_PER_SOL);
  // });
  // connection
  //   .requestAirdrop(anchorWallet.publicKey, 1000000000)
  //   .then((balance) => {
  //     console.log(balance);
  //   });
  const sendPost = async () => {
    if (!anchorWallet) return;
    const network = "http://127.0.0.1:8899";
    const connection = new Connection(network, "processed");
    connection.getBalance(anchorWallet.publicKey).then((balance) => {
      console.log(balance);
    });
    const provider = new AnchorProvider(connection, anchorWallet, {
      preflightCommitment: "processed",
    });
    const program = new Program(idl as Idl, idl.metadata.address, provider);
  };
  return (
    <main>
      <div>content</div>
      <div>posts</div>
    </main>
  );
}
