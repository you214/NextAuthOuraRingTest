import axios from 'axios';
import { useState } from 'react';

import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import { signIn, signOut, useSession } from 'next-auth/react';

console.log('process.env.CLIENT_ID', process.env.CLIENT_ID);

//export default function Component() {
/*
 * .env.localにCLIENT_IDとCLIENT_SECRETを入れてね
 * https://cloud.ouraring.com/oauth/applications
 */

const Home: NextPage = () => {
  const { data: session } = useSession();
  console.log('session', session);
  if (!session) {
    return (
      <div className={styles.container}>
        <Head>
          <title>OURA oauth</title>
          <meta name='description' content='Generated by create next app' />
          <link rel='icon' href='/favicon.ico' />
        </Head>

        <main className={styles.main}>
          <Image
            className='icon'
            src='/favicon.ico'
            width='256'
            height='256'
            alt='icon'
          />
          <h1>Oura Ring API LOGIN!</h1>
          <p>now you're NOT signed in</p>
          <button onClick={() => signIn()}>Sign in</button>
        </main>
      </div>
    );
  }
  if (session) {
    return (
      <div className={styles.container}>
        <Head>
          <title>OURA NERI</title>

          <meta name='description' content='Generated by create next app' />
          <link rel='icon' href='/favicon.ico' />
        </Head>

        <main className={styles.main}>
          <Image
            className='icon'
            src='/favicon.ico'
            width='256'
            height='256'
            alt='icon'
          />
          <h1>Oura Ring API LOGIN!</h1>
          <h1>you're signed in !</h1>
          <button onClick={() => signOut()}>Sign out</button>
        </main>
      </div>
    );
  }
};

export default Home;
