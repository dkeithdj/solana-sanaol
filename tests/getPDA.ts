import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { SolanaSanaol } from "../target/types/solana_sanaol";
import { assert } from "chai";

export const getUserPDA = async (
  program,
  publicKey
): Promise<anchor.web3.PublicKey> => {
  const [userPDA] = await anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("user", "utf-8"), publicKey.toBuffer()],
    program.programId
  );
  return userPDA;
};

export const getPostsPDA = async (
  program,
  publicKey
): Promise<anchor.web3.PublicKey> => {
  const [postsPDA] = await anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("posts", "utf-8")],
    program.programId
  );
  return postsPDA;
};
