import React from 'react'
import Navbar from './Navbar'
import HeroSection from './HeroSection'
import Faq from './Faq'
import AboutUs from './About'
import ProgressiveStack from './Works'

const LandingPage = () => {
  return (
    <div className=''>
      <Navbar />
      <HeroSection />
      <AboutUs />
      <ProgressiveStack />
      <Faq />
    </div>
  )
}

export default LandingPage