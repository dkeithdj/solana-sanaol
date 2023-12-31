// import * as anchor from "@coral-xyz/anchor";
import { BN, Program, web3 } from "@coral-xyz/anchor";

export const getUserPDA = async (
  program: Program,
  publicKey: web3.PublicKey
): Promise<web3.PublicKey> => {
  const [userPDA] = await web3.PublicKey.findProgramAddressSync(
    [Buffer.from("user", "utf-8"), publicKey.toBuffer()],
    program.programId
  );
  return userPDA;
};

export const getPostsPDA = async (
  program: Program
): Promise<web3.PublicKey> => {
  const [postsPDA] = await web3.PublicKey.findProgramAddressSync(
    [Buffer.from("posts", "utf-8")],
    program.programId
  );
  return postsPDA;
};

export const getPostPDA = async (
  program: Program,
  postId: number
): Promise<web3.PublicKey> => {
  const postsIdBuffer = new BN(postId).toBuffer("be", 8);
  const [postPDA] = await web3.PublicKey.findProgramAddressSync(
    [Buffer.from("post", "utf-8"), postsIdBuffer],
    program.programId
  );
  return postPDA;
};

export const getPostLikePDA = async (
  program: Program,
  postId: number,
  author: web3.PublicKey
): Promise<web3.PublicKey> => {
  const postsIdBuffer = new BN(postId).toBuffer("be", 8);
  const [postLikePDA] = await web3.PublicKey.findProgramAddressSync(
    [Buffer.from("post_like", "utf-8"), author.toBuffer(), postsIdBuffer],
    program.programId
  );
  return postLikePDA;
};
