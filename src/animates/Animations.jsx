const AnimatedTitle = () => {
  const title = "Publications de vos ";
  const subtitle = "Articles";

  return (
    <div className="flex flex-col ml-4">
      {/* Animation du titre complet avec lettres qui apparaissent une à une */}
      <h1 className="text-sm font-bold text-blue-600 italic hover:text-blue-700 uppercase flex ">
        {title.split("").map((char, i) => (
          <span
            key={i}
            className="inline-block"
            style={{
              animation: "fadeIn 0.5s ease forwards",
              animationDelay: `${i * 0.3}s`, // Chaque lettre s'affiche après un certain délai
              opacity: 0, // Au départ, chaque lettre est invisible
            }}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </h1>

      {/* Sous-titre */}
      <h1
        className="text-sm italic font-bold text-blue-600 tracking-widest hover:text-blue-400 uppercase ml-10 line-clamp-2"
        style={{
          animation: "fadeIn 0.5s ease forwards", // Animation de fadeIn
          animationDelay: `${title.length * 0.3}s`, // Le sous-titre apparaît après le titre complet
          opacity: 0, // Au départ, le texte est invisible
        }}
      >
        {subtitle}
      </h1>
    </div>
  );
};

export default AnimatedTitle;
