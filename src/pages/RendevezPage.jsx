import React from 'react';
import AppointmentForm from '../actions/AppointmentForm';

const RendezvousPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold text-center mb-6">Prendre un Rendez-vous !!</h1>
        
        {/* Formulaire de prise de rendez-vous */}
        <AppointmentForm />
      </div>
    </div>
  );
};

export default RendezvousPage;
