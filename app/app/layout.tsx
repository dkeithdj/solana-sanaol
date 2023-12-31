require("@solana/wallet-adapter-react-ui/styles.css");
import "@/app/globals.css";
import Nav from "@/components/Nav";
import { WalletConnectProvider } from "@/components/WalletConnectProvider";
import { Toaster } from "@/components/ui/toaster";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Sanaol",
  description: "A place to brag about stuff",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <WalletConnectProvider>
        <body className="">
          <Nav />
          <main className="">{children}</main>
        </body>
      </WalletConnectProvider>
    </html>
  );
}
