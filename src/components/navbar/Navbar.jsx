import Link from 'next/link'
import styles from './navbar.module.css'

const Navbar = () => {
  return (
    <div className={styles.navContainer}>
      <div className={styles.navMenu}>
        <Link href={'/'}>Inicio</Link>
        <Link href={'/'}>Temporadas</Link>
        <Link href={'/'}>Cedula de Identidad</Link>
      </div>
    </div>
  )
}

export default Navbar