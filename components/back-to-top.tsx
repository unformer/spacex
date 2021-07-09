import styled from 'styled-components'
import React, { useEffect, useState } from "react"

const Button = styled.div`  
  display: block;
  position:fixed;
  right:30px;
  bottom:20px;
  img {
      width:60px;
      height:60px;
      cursor:pointer
  }
`

export default function ScrollToTop() {
    
  const [isVisible, setIsVisible] = useState(false)

  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true)
    } else {
      setIsVisible(false)
    }
  }

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    })
  }

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility)
  }, [])

  return (
    <div>
      {isVisible && <Button onClick={scrollToTop}><img src="images/to-top.png" alt="Back to top" /></Button>}
    </div>
  )
}