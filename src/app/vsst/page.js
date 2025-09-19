import Link from "next/link"
import styles from "../page.module.css"
import Image from "next/image"

export default function Home() {
  return (
    <div className={styles.background}>
      <div className={styles.page}>
        <h1 className={styles.title}>Real Racing 3</h1><br/>
        <div className={styles.imagesDiv}>
          <Link href="/vsst/interno" className={styles.link}>
            <div className={styles.imageContainer}>
              <Image src="/vsst.webp" alt="VSST" fill sizes="25vw" className={styles.image}/>
            </div>
            <h2 className={styles.subtitle}>VSST Interno</h2>
          </Link>
          <Link href="/vsst/formula1" className={styles.link}>
            <div className={styles.imageContainer}>
              <Image src="/formula1.webp" alt="Formula 1" fill sizes="25vw" className={styles.image}/>
            </div>
            <h2 className={styles.subtitle}>Formula 1</h2>
          </Link>
          <Link href="/vsst/gt3championship" className={styles.link}>
            <div className={styles.imageContainer}>
              <Image src="/gt3cup.webp" alt="GT3 Championship" fill sizes="25vw" className={styles.image}/>
            </div>
            <h2 className={styles.subtitle}>GT3 Cup</h2>
          </Link>
          <Link href="/vsst/endurancegt" className={styles.link}>
            <div className={styles.imageContainer}>
              <Image src="/endurancegt.webp" alt="Endurance GT" fill sizes="25vw" className={styles.image}/>
            </div>
            <h2 className={styles.subtitle}>Endurance GT</h2>
          </Link>
        </div>
      </div>
    </div>
  )
}
