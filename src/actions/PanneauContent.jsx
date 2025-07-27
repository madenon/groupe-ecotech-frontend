import { useState } from "react";

const PanneauContent = ({ post }) => {
  const MAX_LENGTH = 900;
  const [isExpanded, setIsExpanded] = useState(false);

  const renderContent = () => {
    if (post.content.length <= MAX_LENGTH || isExpanded) {
      return (
        <>
          <p className="mb-2">{post.content}</p>
          {post.content.length > MAX_LENGTH && (
            <button onClick={() => setIsExpanded(false)} className="text-blue-600 hover:underline text-sm">
              Voir moins
            </button>
          )}
        </>
      );
    }
    return (
      <>
        <p className="mb-2">{post.content.slice(0, MAX_LENGTH)}...</p>
        <button onClick={() => setIsExpanded(true)} className="text-blue-400 mb-3 hover:text-blue-600 font-semibold hover:underline text-sm">
          Voir plus
        </button>
      </>
    );
  };

  return (
    <div className="p-2">
      {renderContent()}
    </div>
  );
};

export default PanneauContent;
 