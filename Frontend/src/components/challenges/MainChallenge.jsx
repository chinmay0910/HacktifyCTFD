import React from 'react'
import { Link } from 'react-router-dom'

// fontawesome imports
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

// import components
import PageHeader from '../navbar/PageHeader'


const MainChallenge = () => {
  return (
    <>
      <PageHeader pageTitle="Challenges" route="/challenge/create"/>
    </>
  )
}

export default MainChallenge;