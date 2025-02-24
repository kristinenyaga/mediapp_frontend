import React from 'react'
import Navbar from './Navbar'
import HeroSection from './HeroSection'
import Faq from './Faq'
import AboutUs from './About'
import ProgressiveStack from './Works'
import Footer from './Footer'
import Doctors from './Doctors'

const LandingPage = () => {
  return (
    <div className=''>
      <Navbar />
      <HeroSection />
      <Doctors />
      <AboutUs />
      <ProgressiveStack />
      <Faq />
      <Footer />
      
    </div>
  )
}

export default LandingPage