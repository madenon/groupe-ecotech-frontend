import React from 'react'
import { Link } from 'react-router-dom'

const UserCard = ({user,isConnection}) => {
  return (
    <div className='bg-white rounded-lg shadow p-4 flex flex-col items-center transition-all hover:shadow-md'>
      <Link to={`/profile/${user.username}`} className='flex flex-col items-center'>
      <img src={user.profilePicture || "/avatar.png"} alt="" 
      className='w-20 h-20 rounded-full object-cover mb-4'
      />
      <h3 className='font-semibold text-xl text-center'>{user.name}</h3>
      </Link>
      <p className='text-gray-600 text-center'>{user.headline}</p>
      <p className='text-sm text-gray-500 mt-2'>{user.connections?.length} connections</p>
      <button className='mt-4 bg-[#0A66CC] w-full text-white py-2 px-4 rounded-md hover:bg-[#0A66CC] transition-colors'>{isConnection ? "Connecté" : "Connecter"}</button>
    </div>
  )
}

export default UserCard