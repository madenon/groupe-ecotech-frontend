import React from 'react'
import CreateCountryForm from '../actions/CreateCountryForm'

const CountryPage = () => {
  return (
 <div className="p-6 bg-white text-black">
      <h1 className="text-2xl font-bold mb-6">Créer un pays</h1>
      <CreateCountryForm />
    </div>
  )
}

export default CountryPage