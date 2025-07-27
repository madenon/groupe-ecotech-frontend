import React from 'react';

const NotreEquipe = () => {
  const membres = [
    { nom: 'Meité', prenom: 'Souleymane', poste: 'Manager', experience: '5 ans' },
    { nom: 'Doumbia', prenom: 'Moussa', poste: 'Comptable', experience: '3 ans' },
    { nom: 'Koné', prenom: 'Nabini Siaka', poste: 'IT', experience: '2 ans' },
  ];

  return (
    <div className="py-8 px-4 text-black">
      <h1 className="text-3xl font-bold text-center mb-8">Notre Équipe</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {membres.map((membre, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-md text-center">
            <h2 className="text-xl font-semibold">{membre.nom} {membre.prenom}</h2>
            <p className="text-gray-500">{membre.poste}</p>
            <p className="text-gray-600 mt-2">Expérience: {membre.experience}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotreEquipe;
