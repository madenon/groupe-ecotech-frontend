import { Bell, Book, Scale } from "lucide-react";
import { Link } from "react-router-dom";

const SideBar = ({ user, postCount, isLoadingPostCount }) => {
  if (!user) {
    return <div className="p-4 text-center">Chargement...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow text-black">
      <div className="p-4 text-center">
        <div
          className="h-16 rounded-t-lg bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(rgba(2, 2, 190, 0.2), rgba(2, 2, 190, 0.2)), url("${
              user.bannerImg || "/banner.png"
            }")`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />
        <Link to={`/profile/${user.username}`}>
          <img
            src={user.profilePicture || "/avatar.png"}
            alt={user.name}
            className="w-20 h-20 rounded-full mx-auto mt-[-40px]"
          />
          <h2 className="text-xl font-semibold mt-2  italic">{user.name}</h2>
          <p className="text-gray-600 text-xs">
            {user.connections?.length} connections
          </p>
        </Link>
        <p className="text-gray-600 mt-2">{user.headline}</p>
        <hr className="border-t border-gray-300 my-3" />

        {isLoadingPostCount ? (
          <p className="text-xs text-gray-400 mt-1">
            Chargement des publications...
          </p>
        ) : (
          <p className="text-sm text-gray-600 font-medium mt-3">
            {postCount ?? 0} publication{postCount > 1 ? "s" : ""}
          </p>
        )}
      </div>

      <div className="border-t border-base-100 p-4">
        <nav>
          <ul className="space-y-2">
            <li>
              <Link
                to="/education"
                className="flex items-center py-2 px-4  capitalize rounded-md hover:bg-[#0A66C2] hover:text-white transition-colors"
              >
                <Book className="mr-2" size={20} /> éducation
              </Link>
            </li>
            <li>
              <Link
                to="/notifications"
                className="flex items-center py-2 px-4 rounded-md hover:bg-[#0A66C2] hover:text-white transition-colors"
              >
                <Bell className="mr-2" size={20} /> Notifications
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      <div className="border-t border-base-100 p-4">
        <Link
          to={`/profile/${user.username}`}
          className="text-sm font-semibold"
        >
          Voir votre profil
        </Link>
      </div>
    </div>
  );
};

export default  SideBar