import LoginForm from "../auth/LoginForm";

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-green-100 flex flex-col items-center p-6">
      <div className="w-full max-w-6xl">
        <h2 className="text-center text-xl -mt-7 italic font-extrabold text-emerald-800">
          Bienvenue chez Groupe  Ecotec Innov
        </h2>
        <p className="text-gray-300 font-bold text-center">La plus grande plateforme africaine qui vous accompagne dans plusieurs domaines, notamment les panneaux solaires. Vous avez la possibilité de prendre un rendez-vous en ligne avec un professionnel pour discuter.</p>

        <div className="mt-0 bg-white py-10 px-8 shadow-xl rounded-xl w-full">
          <LoginForm />

         
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
