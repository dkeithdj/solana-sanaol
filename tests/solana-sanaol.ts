import * as anchor from "@coral-xyz/anchor";
import { BN, Program } from "@coral-xyz/anchor";
import { SolanaSanaol } from "../target/types/solana_sanaol";

import { assert } from "chai";
import { getPostLikePDA, getPostPDA, getPostsPDA, getUserPDA } from "./getPDA";

describe("solana-sanaol", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.SolanaSanaol as Program<SolanaSanaol>;
  const publicKey = anchor.AnchorProvider.local().wallet.publicKey;

  it("creates a new user", async () => {
    const userPDA = await getUserPDA(program, publicKey);
    await program.methods
      .createUser("amimir")
      .accounts({
        user: userPDA,
        author: program.provider.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    const userAccount = await program.account.userAccount.fetch(userPDA);
    assert.equal(userAccount.username, "amimir");
    assert.equal(userAccount.author.toBase58(), publicKey.toBase58());
  });

  it("creates a posts account", async () => {
    const postsPDA = await getPostsPDA(program);
    await program.methods
      .createPosts()
      .accounts({
        posts: postsPDA,
        author: program.provider.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();
    const postsAccount = await program.account.postsAccount.fetch(postsPDA);
    assert.equal(postsAccount.postCount.toNumber(), 0);
  });

  it("creates a post account", async () => {
    const userPDA = await getUserPDA(program, publicKey);
    const postsPDA = await getPostsPDA(program);

    let postsAccount = await program.account.postsAccount.fetch(postsPDA);
    const postPDA = await getPostPDA(
      program,
      postsAccount.postCount.toNumber()
    );

    await program.methods
      .createPost("This is a title", "This is a content")
      .accounts({
        user: userPDA,
        posts: postsPDA,
        post: postPDA,
        author: program.provider.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
        timestamp: anchor.web3.SYSVAR_CLOCK_PUBKEY,
      })
      .rpc();

    const postAccount = await program.account.postAccount.fetch(postPDA);
    postsAccount = await program.account.postsAccount.fetch(postsPDA);
    assert.equal(postAccount.author.toBase58(), publicKey.toBase58());
    assert.equal(postAccount.title, "This is a title");
    assert.equal(postAccount.content, "This is a content");
    assert.ok(postAccount.timestamp);
    assert.equal(postsAccount.postCount.toNumber(), 1);
    assert.equal(postAccount.authorUsername, "amimir");
  });

  it("creates a post like account", async () => {
    const postsPDA = await getPostsPDA(program);
    let postsAccount = await program.account.postsAccount.fetch(postsPDA);

    let postCount = postsAccount.postCount.toNumber() - 1;
    const postPDA = await getPostPDA(program, postCount);
    const postLikePDA = await getPostLikePDA(program, postCount, publicKey);

    await program.methods
      .createPostLike(new anchor.BN(postCount), true)
      .accounts({
        post: postPDA,
        postLike: postLikePDA,
        author: program.provider.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    const postLikeAccount = await program.account.postLikeAccount.fetch(
      postLikePDA
    );
    assert.equal(postLikeAccount.author.toBase58(), publicKey.toBase58());
    assert.equal(postLikeAccount.like, true);
    assert.equal(postLikeAccount.postId.toNumber(), postCount);
  });

  // it("should be less than 20 characters of username", async () => {
  //   try {
  //     const userPDA = await getUserPDA(program, publicKey);
  //     await program.methods
  //       .createUser("x".repeat(21))
  //       .accounts({
  //         user: userPDA,
  //         author: program.provider.publicKey,
  //         systemProgram: anchor.web3.SystemProgram.programId,
  //       })
  //       .rpc();
  //   } catch (e) {
  //     assert.equal(
  //       e.error.errorMessage,
  //       "The provided username should be 20 characters long maximum."
  //     );
  //     return;
  //   }

  //   assert.fail(
  //     "The instruction should have failed with a 21-character username."
  //   );
  // });

  // it("creates a new post", async () => {
  //   // create a new post section
  //   const post = anchor.web3.Keypair.generate();
  //   await program.methods
  //     .sendPost("This is a title", "This is a content")
  //     .accounts({
  //       post: post.publicKey,
  //       author: program.provider.publicKey,
  //       systemProgram: anchor.web3.SystemProgram.programId,
  //     })
  //     .signers([post])
  //     .rpc();

  //   // get the post
  //   const postAccount = await program.account.post.fetch(post.publicKey);

  //   assert.equal(
  //     postAccount.author.toBase58(),
  //     program.provider.publicKey.toBase58()
  //   ); // compares author with the program provider
  //   assert.equal(postAccount.title, "This is a title");
  //   assert.equal(postAccount.content, "This is a content");
  //   assert.ok(postAccount.timestamp);
  // });

  // it("creates a new empty post", async () => {
  //   // create a new empty post section
  //   const post = anchor.web3.Keypair.generate();
  //   await program.methods
  //     .sendPost("", "This is a content")
  //     .accounts({
  //       post: post.publicKey,
  //       author: program.provider.publicKey,
  //       systemProgram: anchor.web3.SystemProgram.programId,
  //     })
  //     .signers([post])
  //     .rpc();

  //   // get the post
  //   const postAccount = await program.account.post.fetch(post.publicKey);

  //   assert.equal(
  //     postAccount.author.toBase58(),
  //     program.provider.publicKey.toBase58()
  //   ); // compares author with the program provider
  //   assert.equal(postAccount.title, "");
  //   assert.equal(postAccount.content, "This is a content");
  //   assert.ok(postAccount.timestamp);
  // });

  // it("sends new post from another user", async () => {
  //   // create a new empty post section
  //   const anotherUser = anchor.web3.Keypair.generate();
  //   const signature = await program.provider.connection.requestAirdrop(
  //     anotherUser.publicKey,
  //     1000000000
  //   );
  //   await program.provider.connection.confirmTransaction(signature);

  //   const post = anchor.web3.Keypair.generate();
  //   await program.methods
  //     .sendPost("The quick brown fox", "This is a content")
  //     .accounts({
  //       post: post.publicKey,
  //       author: anotherUser.publicKey,
  //       systemProgram: anchor.web3.SystemProgram.programId,
  //     })
  //     .signers([post, anotherUser])
  //     .rpc();

  //   // get the post
  //   const postAccount = await program.account.post.fetch(post.publicKey);

  //   assert.equal(
  //     postAccount.author.toBase58(),
  //     anotherUser.publicKey.toBase58()
  //   ); // compares author with the program provider
  //   assert.equal(postAccount.title, "The quick brown fox");
  //   assert.equal(postAccount.content, "This is a content");
  //   assert.ok(postAccount.timestamp);
  // });

  // it("should be less than 50 characters of title", async () => {
  //   // create a new post section
  //   try {
  //     const post = anchor.web3.Keypair.generate();
  //     await program.methods
  //       .sendPost("x".repeat(51), "This is a content")
  //       .accounts({
  //         post: post.publicKey,
  //         author: program.provider.publicKey,
  //         systemProgram: anchor.web3.SystemProgram.programId,
  //       })
  //       .signers([post])
  //       .rpc();
  //   } catch (e) {
  //     assert.equal(
  //       e.error.errorMessage,
  //       "The provided title should be 50 characters long maximum."
  //     );
  //     return;
  //   }

  //   assert.fail(
  //     "The instruction should have failed with a 51-character title."
  //   );
  // });

  // it("should be less than 280 characters of content", async () => {
  //   // create a new post section
  //   try {
  //     const post = anchor.web3.Keypair.generate();
  //     await program.methods
  //       .sendPost("Exceeded Content Limit", "x".repeat(281))
  //       .accounts({
  //         post: post.publicKey,
  //         author: program.provider.publicKey,
  //         systemProgram: anchor.web3.SystemProgram.programId,
  //       })
  //       .signers([post])
  //       .rpc();
  //   } catch (e) {
  //     assert.equal(
  //       e.error.errorMessage,
  //       "The provided content should be 280 characters long maximum."
  //     );
  //     return;
  //   }

  //   assert.fail(
  //     "The instruction should have failed with a 281-character content."
  //   );
  // });

  // it("can fetch all posts", async () => {
  //   const postAccounts = await program.account.post.all();
  //   assert.equal(postAccounts.length, 3);
  // });

  // it("can fetch posts from own wallet", async () => {
  //   const authorPublicKey = program.provider.publicKey;
  //   const postAccounts = await program.account.post.all([
  //     { memcmp: { offset: 8, bytes: authorPublicKey.toBase58() } },
  //   ]);
  //   assert.equal(postAccounts.length, 2);
  // });
});
