import { Navigate, Route, Routes } from "react-router-dom";
import SignupPage from "./pages/SignupPage";
import toast, { Toaster } from "react-hot-toast";
import Layout from "./layout/Layout";
import LoginPage from "./pages/LoginPage";
import EmailVerificationPage from "./pages/EmailVerificationPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import HomePage from "./pages/HomePage";
import { Loader } from "lucide-react";
import EducationCourses from "./pages/EducationCourses";
import PostEditForm from "./actions/EditForm";
import Notification from "./components/Notification";
import SearchResults from "./components/SearchResults";
import PostDetail from "./pages/PostDetail";
import NetworkPage from "./pages/NetWorkPage";
import ProfilePage from "./pages/ProfilePage";
import RequireAdmin from "./admins/RequireAdmin";
import RequireSuperAdmin from "./admins/RequireSuperAdmin";
import SuperAdminPage from "./components/SuperAdminPage";
import AdminPage from "./components/AdminPage";
import Cookie from "./conditions/Cookie";
import Mentions from "./conditions/Mentions";
import Condition from "./conditions/Conditions";
import LegalTextForm from "./actions/LegaltText";
import AdminLegalTextEdit from "./conditions/AdminLegalTextEdit";
import NotreEquipe from "./components/NotreEquipe";
import { useAuth } from "./context/AuthContext";
import AboutPage from "./components/AboutPage";
import Publication from "./pages/Publication";
import NotreMission from "./pages/NotreMission";
import PanneauCreationPage from "./pages/PanneauCreationPage";
import PanneauxPage from "./pages/PanneauxPage";
import Listerendezvous from "./pages/Listerendezvous";
import CountryPage from "./pages/CountryPage";
import UpdateCountry from "./pages/UpdateCountry";
import NosCoursPage from "./pages/NosCoursPage";
import LesCours from "./pages/LesCours";
import PanneauMission from "./pages/PanneauMission";
import AboutHistoir from "./pages/AboutHistoir";

// Fonction pour simplifier la logique de redirection
const redirectIfAuthenticated = (element, authUser) => {
  if (authUser) {
    return authUser.isVerified ? <Navigate to="/" /> : <Navigate to="/login" />;
  }
  return element;
};

function App() {
  const { authUser, isLoading } = useAuth();

  if (isLoading) return <Loader className="mx-auto animate-spin" />;

  const isEmailVerified = authUser?.isVerified;

  return (
    <Layout>
      <Routes>
        {/* Routes protégées */}
        <Route
          path="/"
          element={
            authUser && isEmailVerified ? (
              <HomePage />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/network"
          element={
            authUser && isEmailVerified ? (
              <NetworkPage />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/profile/:username"
          element={
            authUser && isEmailVerified ? <ProfilePage /> : <Navigate to="/" />
          }
        />

        {/* Admin / SuperAdmin */}
        <Route
          path="/admin/dashboard"
          element={
            <RequireAdmin>
              <AdminPage />
            </RequireAdmin>
          }
        />
        <Route
          path="/superadmin/gestion"
          element={
            <RequireSuperAdmin>
              <SuperAdminPage />
            </RequireSuperAdmin>
          }
        />

        {/* Routes des posts */}
        <Route
          path="/search"
          element={
            authUser && isEmailVerified ? (
              <SearchResults />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/post/preview/:postId"
          element={
            authUser && isEmailVerified ? (
              <PostDetail />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/post/:postId"
          element={
            authUser && isEmailVerified ? (
              <PostEditForm />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/notifications"
          element={
            authUser && isEmailVerified ? (
              <Notification />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Pages d'authentification */}
        <Route
          path="/signup"
          element={redirectIfAuthenticated(<SignupPage />, authUser)}
        />
        <Route
          path="/login"
          element={redirectIfAuthenticated(<LoginPage />, authUser)}
        />
        <Route path="/verify-email" element={<EmailVerificationPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route
          path="/reset-password/:panneaux"
          element={<ResetPasswordPage />}
        />

        {/* Création des conditions et cookies */}
        <Route
          path="/admin/:type"
          element={
            authUser && isEmailVerified ? (
              <AdminLegalTextEdit />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/admin/:type/create"
          element={
            authUser && isEmailVerified ? (
              <AdminLegalTextEdit />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Panneaux */}
        <Route
          path="/panneaux/publication"
          element={
            authUser && isEmailVerified ? (
              <Publication />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/panneaux/mission"
          element={
            authUser && isEmailVerified ? (
              <NotreMission />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/panneaux/creer"
          element={
            authUser && isEmailVerified ? (
              <PanneauCreationPage />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/panneaux/creer/mission"
          element={
            authUser && isEmailVerified ? (
              <PanneauMission />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/panneaux"
          element={
            authUser && isEmailVerified ? (
              <PanneauxPage />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/listerendezvous"
          element={
            authUser && isEmailVerified ? (
              <Listerendezvous />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/countries/create"
          element={
            authUser && isEmailVerified ? (
              <CountryPage />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/countries/gerer"
          element={
            authUser && isEmailVerified ? (
              <UpdateCountry />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Cours */}
        <Route
          path="/education/courses"
          element={
            authUser && isEmailVerified ? (
              <NosCoursPage />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/cours/creer"
          element={
            authUser && isEmailVerified ? (
              <LesCours />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Pages légales */}
        <Route path="/cookies" element={<Cookie />} />
        <Route path="/mentions-legales" element={<Mentions />} />
        <Route path="/conditions-generales" element={<Condition />} />

        {/* À propos */}
        <Route
          path="/equipe"
          element={
            authUser && isEmailVerified ? (
              <NotreEquipe />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/a-propos"
          element={
            authUser && isEmailVerified ? (
              <AboutPage />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/about/create"
          element={
            authUser && isEmailVerified ? (
              <AboutHistoir />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
      <Toaster />
    </Layout>
  );
}

export default App;
