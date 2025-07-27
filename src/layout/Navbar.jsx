import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Bell, GavelIcon, Home, Search, Sun, Users } from "lucide-react";
import { useState } from "react";
import React from "react";
import AnimatedTitle from "../animates/Animations";
import { useAuth } from "../context/AuthContext";
import { adminLinks, superAdminLinks } from "../admins/AdminLinks";

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [hoveredMenu, setHoveredMenu] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);
  const { authUser } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const toggleUserMenu = () => setUserMenuOpen((prev) => !prev);

  const { data: notifications = [] } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const res = await axiosInstance.get("/notifications");
      return res.data;
    },
    enabled: !!authUser,
  });

  const { data: connectionRequests = [] } = useQuery({
    queryKey: ["connectionRequests"],
    queryFn: async () => {
      const res = await axiosInstance.get("/connections/requests");
      return res.data;
    },
    enabled: !!authUser,
  });

  const unreadNotificationCount = Array.isArray(notifications)
    ? notifications.filter((n) => !n.read).length
    : 0;

  const unreadConnectionRequestCount = connectionRequests?.length || 0;
  const handleMouseEnter = (label) => {
    if (timeoutId) clearTimeout(timeoutId); // Clear any existing timeout
    setHoveredMenu(label);
  };

  const handleMouseLeave = () => {
    const id = setTimeout(() => {
      setHoveredMenu(null);
    }, 300); // Delay the menu hide by 300ms
    setTimeoutId(id);
  };

  const navLinks = [
    {
      to: "/",
      icon: <Home />,
      label: "Accueil",
      megaMenu: [
        {
          to: "",
          icon: <Home />,
          label: "Accueil",
        },
        {
          to: "/network",
          icon: <Users />,
          label: "Ami(e)s",
          badge: unreadConnectionRequestCount,
        },
      ],
    },
    {
      to: "/panneaux",
      icon: <Sun />,
      label: "Panneaux",
      megaMenu: [
        { label: "Nos publication", to: "/panneaux" },
        { label: "Pourquoi les panneaux soliaires", to: "/panneaux/mission" },
      ],
    },
    {
      to: "/education",
      icon: <GavelIcon />,
      label: "Éducation",
      megaMenu: [
        { label: "Cours en ligne", to: "/education/courses" },
        { label: "Documentation", to: "/education/documents" },
        { label: "Exercices", to: "/education/videos" },
      ],
    },
    {
      to: "/notifications",
      icon: <Bell />,
      label: "Notifications",
      badge: unreadNotificationCount,
    },
  ];

  const { mutate: logout } = useMutation({
    mutationFn: async () => axiosInstance.post("/auth/logout"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      navigate("/");
    },
  });

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    setSearchTerm("");
  };

  const getDesktopNavLinkClasses = (isActive) =>
    `flex items-center text-xl gap-2 py-2 font-bold rounded-md transition-all ${
      isActive
        ? "text-white border-b-4 border-white hover:text-gray-500"
        : "text-white hover:text-gray-600"
    }`;

  return (
    <nav className="bg-orange-400 shadow-md sticky top-0 z-50 px-10">
      {/* Desktop Navbar */}
      <div className="w-full hidden md:flex py-3 items-center justify-between relative">
        <Link to="/" className="flex items-center gap-2">
          <img
            className="w-16 h-16 rounded-full object-cover bg-gray-200"
            src="/l.jpg"
            alt="Logo"
          />
        </Link>
        <AnimatedTitle />
        {authUser && (
          <form
            onSubmit={handleSearch}
            className="relative flex-1 max-w-md mx-8"
          >
            <input
              type="text"
              placeholder="Rechercher un post"
              className="pl-4 pr-10 py-2 border rounded-md bg-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className="absolute right-3 top-2 text-white">
              <Search size={18} />
            </button>
          </form>
        )}

        <div className="flex items-center gap-1 text-xl">
          {authUser ? (
            <>
              {navLinks.map(({ to, icon, label, badge, megaMenu }) => (
                <div
                  key={label}
                  className="relative"
                  onMouseEnter={() => megaMenu && handleMouseEnter(label)}
                  onMouseLeave={() => megaMenu && handleMouseLeave()}
                >
                  <NavLink
                    to={to}
                    className={({ isActive }) =>
                      getDesktopNavLinkClasses(isActive)
                    }
                  >
                    <div className="relative">
                      {icon}
                      {badge > 0 && (
                        <span className="absolute -top-1 -right-1 text-white bg-blue-500 text-[8px] rounded-full h-4 w-4 flex items-center justify-center">
                          {badge > 9 ? "10+" : badge}
                        </span>
                      )}
                    </div>
                    <span className="text-[12px] hidden md:block">{label}</span>
                  </NavLink>

                  {hoveredMenu === label && megaMenu && (
                    <div className="absolute -translate-x-1/2 top-full mt-2 bg-gray-100 text-black shadow-lg rounded-md p-6 w-[400px] grid grid-cols-2 gap-4 z-50">
                      {megaMenu.map((item) => (
                        <Link
                          key={item.to}
                          to={item.to}
                          className="hover:text-blue-600 text-sm font-medium"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Menu Utilisateur */}
              <div className="relative flex flex-col items-center">
                <button
                  onClick={toggleUserMenu}
                  className="flex items-center focus:outline-none"
                >
                  <img
                    src={authUser?.profilePicture || "/default-avatar.png"}
                    alt="Profil"
                    className="w-8 h-8 rounded-full object-cover border border-white"
                  />
                </button>
                {userMenuOpen && (
                  <div className="absolute top-full -right-2 text-black bg-orange-300 shadow-md rounded-lg m-3 p-4 w-56 z-20 max-h-96 overflow-y-auto">
                    <div className="px-4 py-3 border-b border-gray-200">
                      <p className="font-semibold">
                        {authUser.name || authUser.username}
                      </p>
                      <p className="text-sm text-gray-600">{authUser.email}</p>
                    </div>

                    <Link
                      to={`/profile/${authUser.username}`}
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Mon profil
                    </Link>

                    {authUser.isAdmin && (
                      <>
                        <p className="px-2 pt-2 text-sm font-semibold text-gray-600">
                          Espace Admin
                        </p>
                        {adminLinks.map((link) => (
                          <Link
                            key={link.to}
                            to={link.to}
                            className="block px-1 py-1 text-sm hover:bg-gray-100"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            {link.label}
                          </Link>
                        ))}
                      </>
                    )}

                    {authUser.isSuperAdmin && (
                      <>
                        <p className="px-1 pt-2 text-sm font-semibold text-gray-600">
                          Espace Super Admin
                        </p>
                        {superAdminLinks.map((link) => (
                          <Link
                            key={link.to}
                            to={link.to}
                            className="block px-2 text-sm py-1 hover:bg-gray-100"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            {link.label}
                          </Link>
                        ))}
                      </>
                    )}

                    <button
                      onClick={() => {
                        logout();
                        setUserMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600 font-semibold"
                    >
                      Déconnexion
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="bg-blue-600 text-xl hover:text-black hover:bg-blue-900 px-4 py-2 rounded transition"
              >
                Se connecter
              </Link>
              <Link
                to="/signup"
                className="bg-blue-600 text-white text-xl px-4 py-2 rounded hover:bg-blue-900 transition"
              >
                Rejoignez-nous maintenant
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile Navbar FIXED at bottom */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-orange-200 py-1 px-2 flex justify-between md:hidden border-t border-gray-300">
        {authUser ? (
          <>
            {navLinks.map(({ to, icon, label, badge, megaMenu }) => (
              <div key={label} className="flex-1 relative">
                <button
                  onClick={() =>
                    setMobileMenuOpen((prev) => (prev === label ? null : label))
                  }
                  className="w-full flex flex-col items-center justify-center gap-1 text-xs font-medium text-white/80 hover:text-white relative"
                >
                  <div className="relative">
                    {React.cloneElement(icon, { size: 22 })}
                    {badge > 0 && (
                      <span className="absolute -top-1 -right-1 text-white bg-blue-500 text-[8px] rounded-full h-4 w-4 flex items-center justify-center">
                        {badge > 9 ? "10+" : badge}
                      </span>
                    )}
                  </div>
                  <span>{label}</span>
                </button>

                {/* Sous-menu mobile */}
                {mobileMenuOpen === label && megaMenu && (
                  <div className="absolute bottom-14 left-0 bg-white text-black rounded-t-md shadow-lg py-4 px-4 z-50 w-64">
                    {megaMenu.map((item) => (
                      <Link
                        key={item.to}
                        to={item.to}
                        className="block py-2 text-sm font-medium border-b border-gray-200"
                        onClick={() => setMobileMenuOpen(null)}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Icône profil avec sous-menu */}
            <div className="relative flex flex-col items-center">
              <button
                onClick={toggleUserMenu}
                className="w-full flex flex-col items-center justify-center gap-1 text-xs font-medium text-white/80 hover:text-white"
              >
                <img
                  src={authUser?.profilePicture || "/default-avatar.png"}
                  alt="Profil"
                  className="w-6 h-6 rounded-full object-cover border border-white"
                />
                <span>Profil</span>
              </button>

              {userMenuOpen && (
                <div className="absolute top-full right-7 bg-white text-black -mt-[30rem]  border shadow-lg rounded-lg p-2 w-48 z-20">
                  <Link
                    to={`/profile/${authUser.username}`}
                    onClick={() => setUserMenuOpen(false)}
                    className="block py-2 text-sm font-medium border-b border-gray-200"
                  >
                    Mon profil
                  </Link>

                  {authUser.isAdmin && (
                    <>
                      <p className="px-2 pt-2 text-sm font-semibold text-gray-600">
                        Espace Admin
                      </p>
                      {adminLinks.map((link) => (
                        <Link
                          key={link.to}
                          to={link.to}
                          className="block px-1 py-1 text-sm hover:bg-gray-100"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          {link.label}
                        </Link>
                      ))}
                    </>
                  )}

                  {authUser.isSuperAdmin && (
                    <>
                      <p className="px-2 pt-2 text-sm font-semibold text-gray-600">
                        Super Admin
                      </p>
                      {superAdminLinks.map((link) => (
                        <Link
                          key={link.to}
                          to={link.to}
                          className="block px-2 text-sm py-1 hover:bg-gray-100"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          {link.label}
                        </Link>
                      ))}
                    </>
                  )}

                  <button
                    onClick={() => {
                      logout();
                      setUserMenuOpen(false);
                    }}
                    className="w-full text-left text-red-600 font-semibold py-2"
                  >
                    Déconnexion
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="flex flex-col items-center flex-1 text-white"
            >
              <Search size={22} />
              <span>Se connecter</span>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
