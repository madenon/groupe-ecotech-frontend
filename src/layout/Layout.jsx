import Footer from "./Footer";
import Navbar from "./Navbar";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-300">
      <Navbar />
      <main className="max-w-7xl w-full flex-grow mx-auto px-1 py-4 bg-white rounded-md shadow">

        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
