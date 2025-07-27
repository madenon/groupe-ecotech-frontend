import React from 'react'
import CountryList from '../actions/CountryList'
const UpdateCountry = () => {
  return (
     <div className="p-6 bg-white text-black">
      <h1 className="text-2xl font-bold mb-6">Liste des pays</h1>
      <CountryList />
    </div>
  )
}

export default UpdateCountry