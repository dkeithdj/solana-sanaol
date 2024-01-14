import * as anchor from "@coral-xyz/anchor";
import { BN, Program } from "@coral-xyz/anchor";
import { SolanaSanaol } from "../target/types/solana_sanaol";

import { assert } from "chai";
import { SYSVAR_CLOCK_PUBKEY } from "@solana/web3.js";

describe("solana-sanaol", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.SolanaSanaol as Program<SolanaSanaol>;
  const publicKey = anchor.AnchorProvider.local().wallet.publicKey;

  it("creates a user", async () => {
    const tx = await program.methods.createUser().accounts({
      user: publicKey,
      systemProgram: anchor.web3.SystemProgram.programId,
    });
    console.log("Signature:", tx);
  });

  it("creates a post", async () => {
    const postPubKey = anchor.web3.Keypair.generate();
    await program.methods
      .createPost("Hello World", "This is a content")
      .accounts({
        user: publicKey,
        post: postPubKey.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
        timestamp: SYSVAR_CLOCK_PUBKEY,
      });
  });
  it("creates another post", async () => {
    const postPubKey = anchor.web3.Keypair.generate();
    await program.methods
      .createPost("Hello Again World", "This is another content")
      .accounts({
        user: publicKey,
        post: postPubKey.publicKey,
        author: publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
        timestamp: SYSVAR_CLOCK_PUBKEY,
      });
    await program.methods
      .createPost("Hello Again World", "This is another content")
      .accounts({
        user: publicKey,
        post: postPubKey.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
        timestamp: SYSVAR_CLOCK_PUBKEY,
      });
    const posts = await program.account.postAccount.all();
    console.log(posts);
  });
});
