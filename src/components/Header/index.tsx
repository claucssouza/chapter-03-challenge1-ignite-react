import styles from './header.module.scss';
import Link from 'next/link'
import Head from 'next/head';

export interface IHeader {
  pageTitle: string;
}

export default function Header({ pageTitle }: IHeader) {
  return (
    <header>
      <Head><title>{pageTitle} | spacetraveling</title></Head>
    <div className={styles.contentContainer}>      
      <Link href="/">
        <img src="/assets/images/logo.svg" alt="logo" />
      </Link>
    </div>
    </header>
  )
}
