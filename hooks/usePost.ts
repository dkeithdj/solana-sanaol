import { AnchorProvider, Program } from "@coral-xyz/anchor";
import {
  useAnchorWallet,
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";
import { useEffect, useMemo, useState } from "react";
import idl from "@/public/solana_sanaol.json";
import { getPostPDA, getPostsPDA, getUserPDA } from "@/lib/getPDA";

const usePost = () => {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const anchorWallet = useAnchorWallet();

  const [initialized, setInitialized] = useState(false);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [transactionPending, setTransactionPending] = useState(false);

  const program = useMemo(() => {
    if (anchorWallet) {
      const provider = new AnchorProvider(
        connection,
        anchorWallet,
        AnchorProvider.defaultOptions()
      );
      return new Program(
        JSON.parse(JSON.stringify(idl)),
        idl.metadata.address,
        provider
      );
    }
  }, [connection, anchorWallet]);

  useEffect(() => {
    const findUserAccount = async () => {
      if (program && publicKey && !transactionPending) {
        try {
          setLoading(true);
          const userPDA = await getUserPDA(program, publicKey);
          // const postsPDA = await getPostsPDA(program);
          // let postsAccount = await program.account.postsAccount.fetch(postsPDA);
          // const postPDA = await getPostPDA(
          //   program,
          //   (
          //     postsAccount as { postCount: { toNumber: () => number } }
          //   ).postCount.toNumber()
          // );

          // const postPDA = await program.account.postAccount.all();
          // const posts = postsAccount.posts.map(async (post) => {
          //   const postPDA = await program.account.postAccount.all();
          //   const postAccount = await program.account.postAccount.fetch(
          //     postPDA
          //   );
          // return postAccount;
          // });
          setPosts(posts);
          setLoading(false);
        } catch (error) {}
      }
    };
  }, []);
};

export default usePost;
