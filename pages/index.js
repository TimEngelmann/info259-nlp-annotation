import Head from "next/head";
import Image from "next/image";
import { useContext } from "react";
import styles from "../styles/Home.module.css";
import { Button } from "antd";

import Link from "next/link";

import { AuthUserContext } from "../utils/auth";

export default function Home() {
  const userContext = useContext(AuthUserContext);

  return (
    <div className={styles.container}>
      <Head>
        <title>Project 1</title>
        <meta name="description" content="The first of many" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div>
        {!userContext.user && (
          <Link href="/login">
            <Button>Login</Button>
          </Link>
        )}
        {userContext.user && (
          <div>
            <Button onClick={() => userContext.logout()}>
              {userContext.userDoc.name}, Logout
            </Button>
          </div>
        )}
      </div>

      <main className={styles.main}>
        <h1>Welcome to the oracle</h1>
        <p>Type your question here</p>
        <input></input>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  );
}
