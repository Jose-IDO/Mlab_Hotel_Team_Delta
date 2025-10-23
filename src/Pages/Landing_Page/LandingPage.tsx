import { useState, useEffect } from 'react'
import styles from './LandingPage.module.css'
import SearchSection from "../../Components/SearchSection/SearchSection"
import DealsSection from '../../Components/DealSection/DealSection'

import santorini1 from '../../assets/Santorini_1.jpg'
import santorini2 from '../../assets/Santorini_2.jpg'
import santorini3 from '../../assets/Santorini_3.jpg'
import santorini4 from '../../assets/Santorini_4.jpg'
import santorini5 from '../../assets/Santorini_5.jpg'
import santorini6 from '../../assets/Santorini_6.jpg'
import santorini7 from '../../assets/Santorini_7.jpg'

export const LandingPage = () => {
  const [currentImage, setCurrentImage] = useState(0)
  const images = [santorini1, santorini2, santorini3, santorini4, santorini5, santorini6, santorini7]

  const nextImage = () => {
    setCurrentImage(current => current === images.length - 1 ? 0 : current + 1)
  }

  const prevImage = () => {
    setCurrentImage(current => current === 0 ? images.length - 1 : current - 1)
  }

  useEffect(() => {
    const timer = setInterval(nextImage, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div>
      <div className={styles.sectionone}>
        <div className={styles.slideContainer} style={{ transform: `translateX(-${currentImage * 100}%)` }}>
          {images.map((img, index) => (
            <div
              key={index}
              className={styles.slide}
              style={{ backgroundImage: `url(${img})` }}
            />
          ))}
        </div>
        <button onClick={prevImage} className={styles.sliderButton + ' ' + styles.leftButton}>&lt;</button>
        <button onClick={nextImage} className={styles.sliderButton + ' ' + styles.rightButton}>&gt;</button>
        <div className={styles.textContent}>
          <div>Welcome to Delta's Signature Stays.</div>
          <div>Where comfort meets elegance.</div>
          <div>your journey truly, begins with us.</div>
        </div>
      </div>

      <div className={styles.searchsection}> 
        <SearchSection />
      </div>
      <DealsSection/>
    </div>
  )
}
