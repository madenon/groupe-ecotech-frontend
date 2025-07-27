
export default function PanneauAction({icon, text, onClick}) {
  return (
     <button
    onClick={onClick}
      className="flex items-center gap-1 px-3 py-2 text-sm text-gray-600 hover:bg-gray-200 rounded-md transition duration-150 ease-in-out w-full justify-center sm:justify-start"
    style={{ minWidth: "100px" }} // 
  >
    {icon}
    <span>{text}</span>
  </button>
  )
}

 