import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import { Archivo } from "next/font/google";
import { extendTheme, ChakraProvider } from "@chakra-ui/react";

import Head from "next/head";
import SideNav from "~/components/SideNav";

const fonts = Archivo({
  weight: ["400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});

const config = {
  useSystemColorMode: false,
  initialColorMode: "dark",
}

const customTheme = extendTheme({ config })

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <ChakraProvider theme={customTheme}>
        <main className={fonts.className}>
          <Head>
            <title>NextAuth.js Example</title>
            <meta name="description" content="NextAuth.js Example" />
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <div className="container mx-auto flex items-start">
            <SideNav />
            <div className="min-h-screen flex-grow border-x">
                <Component {...pageProps} />
            </div>
          </div>
        </main>
      </ChakraProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
