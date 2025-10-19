import styles from './LandingPage.module.css'
import SearchSection from "../Components/SearchSection/SearchSection"
import DealsSection from '../Components/DealSection/DealSection'

export const LandingPage = () => {
  return (
    <div>
        <div className = {styles.sectionone}>
            <div> Welcome to Mlab Signature Stays</div>
            <div> Where comfort meets elegance</div>
            <div> your journey begins with us.</div>
        </div>

        <div className = {styles.searchsection}> 
        <SearchSection />
        </div>
        <DealsSection/>




    </div>
  )
}
