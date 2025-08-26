import Link from 'next/link'
import styles from './navbar.module.css'

const Navbar = () => {
  return (
    <div className={styles.navContainer}>
      <div className={styles.navMenu}>
        <Link href={'/'}>
          <h3 className={styles.h3}>Inicio</h3>
        </Link>
        <Link href={'/vsst'}>
          <h3 className={styles.h3}>VSST</h3>
        </Link>
        <Link href={'/midnight'}>
          <h3 className={styles.h3}>Midnight</h3>
        </Link>
      </div>
    </div>
  )
}

export default Navbar