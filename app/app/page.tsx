"use client";
import Image from "next/image";
import idl from "@/public/solana_sanaol.json";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { AnchorProvider, Idl, Program, web3 } from "@coral-xyz/anchor";
import { useState } from "react";
import { getPostPDA, getPostsPDA, getUserPDA } from "@/lib/getPDA";
import PostList from "@/components/posts/PostList";
import UsernameForm from "@/components/UsernameForm";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { ToastAction } from "@/components/ui/toast";

export default function Home() {
  const { toast } = useToast();
  const anchorWallet = useAnchorWallet();
  const [posts, setPosts] = useState([]);
  const [hasUsername, setHasUsername] = useState(false);
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
    const program = new Program(
      JSON.parse(JSON.stringify(idl)),
      idl.metadata.address,
      provider
    );
  };

  console.log(anchorWallet?.publicKey.toString());

  const createUser = async () => {
    if (!anchorWallet) return;
    const network = "http://127.0.0.1:8899";
    const connection = new Connection(network, "processed");
    const provider = new AnchorProvider(connection, anchorWallet, {
      commitment: "processed",
    });
    const program = new Program(
      JSON.parse(JSON.stringify(idl)),
      idl.metadata.address,
      provider
    );

    try {
      const userKey = new PublicKey(anchorWallet.publicKey.toString());
      const [userPDA] = await PublicKey.findProgramAddressSync(
        [Buffer.from("user", "utf-8"), userKey.toBuffer()],
        program.programId
      );
      console.log("userPDA", userPDA.toString());
      const createUserTx = await program.methods
        .createUser("amimir")
        .accounts({
          user: userPDA,
          author: program.provider.publicKey,
          systemProgram: web3.SystemProgram.programId,
        })
        .rpc();

      console.log("createUserTx", createUserTx);

      const userAccount = await program.account.userAccount.fetch(userPDA);
      // console.log("username", userAccount.username);
      // const userPDA = await getUserPDA(program, anchorWallet.publicKey);
      // await program.methods
      //   .createUser("amimir")
      //   .accounts({
      //     user: userPDA,
      //     author: program.provider.publicKey,
      //     systemProgram: web3.SystemProgram.programId,
      //   })
      //   .rpc();

      // const userAccount = await program.account.userAccount.fetch(userPDA);
      // console.log(userAccount.username);
    } catch (error) {
      console.log(error);
    }
  };

  const getUsername = async () => {
    if (!anchorWallet) return;
    const network = "http://127.0.0.1:8899";
    const connection = new Connection(network, "processed");
    const provider = new AnchorProvider(connection, anchorWallet, {
      commitment: "processed",
    });
    const program = new Program(
      JSON.parse(JSON.stringify(idl)),
      idl.metadata.address,
      provider
    );

    try {
      const userKey = new PublicKey(anchorWallet.publicKey.toString());
      const [userPDA] = await PublicKey.findProgramAddressSync(
        [Buffer.from("user", "utf-8"), userKey.toBuffer()],
        program.programId
      );
      console.log("userPDA", userPDA.toString());

      // const userAccount = await program.account.userAccount.fetch(userPDA);
      // const userAccount = await program.account.userAccount.fetch(userPDA)
      // console.log(userAccount);
      const userAccount = await program.account.userAccount.fetchNullable(
        userPDA
      );
      if (!userAccount) {
        toast({
          title: "popup",
        });
      }
      console.log(userAccount);
      // if (userAccount === null) {
      //   console.log("none");
      // }
      // console.log("username", userAccount.username);
    } catch (error) {
      toast({
        title: "error",
        description: "error, no user yet",
      });
      console.log(error);
    }
  };

  const createPosts = async () => {
    if (!anchorWallet) return;
    const network = "http://127.0.0.1:8899";
    const connection = new Connection(network, "processed");
    const provider = new AnchorProvider(connection, anchorWallet, {
      commitment: "processed",
    });
    const program = new Program(
      JSON.parse(JSON.stringify(idl)),
      idl.metadata.address,
      provider
    );

    try {
      const postsPDA = await getPostsPDA(program);
      await program.methods
        .createPosts()
        .accounts({
          posts: postsPDA,
          author: program.provider.publicKey,
          systemProgram: web3.SystemProgram.programId,
        })
        .rpc();
      const postsAccount = await program.account.postsAccount.fetch(postsPDA);
      console.log(postsAccount);
    } catch (error) {
      console.log(error);
    }
  };

  // const createPost = async () => {
  //   if (!anchorWallet) return;
  //   const network = "http://127.0.0.1:8899";
  //   const connection = new Connection(network, "processed");
  //   const provider = new AnchorProvider(connection, anchorWallet, {
  //     commitment: "processed",
  //   });
  //   const program = new Program(idl as Idl, idl.metadata.address, provider);
  //   try {
  //     const publicKey = new PublicKey(anchorWallet.publicKey.toString());

  //     const userPDA = await getUserPDA(program, publicKey);
  //     const [postsPDA] = await web3.PublicKey.findProgramAddressSync(
  //       [Buffer.from("posts", "utf-8")],
  //       program.programId
  //     );

  //     let postsAccount = await program.account.postsAccount.fetch(postsPDA);

  //     console.log(postsAccount);
  //     const postPDA = await getPostPDA(
  //       program,
  //       postsAccount.postCount.toNumber()
  //     );

  //     await program.methods
  //       .createPost("This is a title", "This is a content")
  //       .accounts({
  //         user: userPDA,
  //         posts: postsPDA,
  //         post: postPDA,
  //         author: program.provider.publicKey,
  //         systemProgram: web3.SystemProgram.programId,
  //         timestamp: web3.SYSVAR_CLOCK_PUBKEY,
  //       })
  //       .rpc();

  //     const postAccount = await program.account.postAccount.fetch(postPDA);
  //     console.log(postAccount);
  //     postsAccount = await program.account.postsAccount.fetch(postsPDA);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  return (
    <main>
      <Toaster />
      <div>content</div>
      <div>posts</div>
      <div className="flex flex-col">
        <UsernameForm hasUsername={true} />
        <button onClick={createUser}>create user</button>
        <button onClick={getUsername}>get user</button>
        <button onClick={createPosts}>create posts</button>
        {/* <button onClick={createPost}>create posts</button> */}
      </div>
      <div>
        <PostList />
      </div>
    </main>
  );
}
