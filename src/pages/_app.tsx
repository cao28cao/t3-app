import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";



import { api } from "~/utils/api";

import "~/styles/globals.css";
import { ChakraProvider } from "@chakra-ui/react";

import Head from "next/head";
import SideNav from "~/components/SideNav";


const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <Head>
        <title>NextAuth.js Example</title>
        <meta name="description" content="NextAuth.js Example" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className='container mx-auto flex items-start'>
        <SideNav />
        <div className="min-h-screen flex-grow border-x">
          <ChakraProvider>
              <Component {...pageProps} />
          </ChakraProvider>
        </div>
      </div>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
