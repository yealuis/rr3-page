import Link from "next/link"
import styles from "./page.module.css"
import Image from "next/image"

export default function Home() {
  return (
    <div className={styles.background}>
      <div className={styles.page}>
        <h1 className={styles.title}>Real Racing 3</h1><br/>
        <div className={styles.imagesDiv}>
          <Link href="/vsst" className={styles.link}>
            <div className={styles.imageContainer}>
              <Image src="/vsst.webp" alt="VSST" fill sizes="25vw" className={styles.image}/>
            </div>
            <h2 className={styles.subtitle}>VSST</h2>
          </Link>
          <Link href="/midnight" className={styles.link}>
            <div className={styles.imageContainer}>
              <Image src="/midnight.webp" alt="Midnight" fill sizes="25vw" className={styles.image}/>
            </div>
            <h2 className={styles.subtitle}>Midnight Club</h2>
          </Link>
        </div>
      </div>
    </div>
  )
}
