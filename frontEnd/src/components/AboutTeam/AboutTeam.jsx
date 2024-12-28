import React from 'react'
import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'

const baseurl = import.meta.env.VITE_BASE_URL
function AboutTeam() {
  const email = useSelector((state)=>state.user.email)
  const isAuth = useSelector((state)=>state.user.isAuthenticated)
  return (
    <motion.div
      initial={{ opacity: 0 }}    // Initial opacity before the page loads
      animate={{ opacity: 1 }}    // Animate to full opacity
      exit={{ opacity: 0 }}       // Fade out when navigating away
      transition={{ duration: 0.5 }} // Transition duration
    >
      <h1>Welcome to the Home Page!</h1>
    </motion.div>
  );
}



export default AboutTeam
