import styles from './header.module.scss';
import Link from 'next/link'

export default function Header() {
  return (
    <div className={styles.contentContainer}>
      <Link href="/">
        <img src="/assets/images/logo.svg" alt="logo" />
      </Link>
    </div>
  )
}
