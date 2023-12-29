import * as anchor from "@coral-xyz/anchor";
import { BN } from "@coral-xyz/anchor";

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

export const getPostsPDA = async (program): Promise<anchor.web3.PublicKey> => {
  const [postsPDA] = await anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("posts", "utf-8")],
    program.programId
  );
  return postsPDA;
};

export const getPostPDA = async (
  program,
  postId
): Promise<anchor.web3.PublicKey> => {
  const postsIdBuffer = new BN(postId).toBuffer("be", 8);
  const [postPDA] = await anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("post", "utf-8"), postsIdBuffer],
    program.programId
  );
  return postPDA;
};

export const getPostLikePDA = async (
  program,
  postId: number,
  author: anchor.web3.PublicKey
): Promise<anchor.web3.PublicKey> => {
  const postsIdBuffer = new BN(postId).toBuffer("be", 8);
  const [postLikePDA] = await anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("post_like", "utf-8"), author.toBuffer(), postsIdBuffer],
    program.programId
  );
  return postLikePDA;
};
