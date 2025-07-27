import React from "react";
import PanneauCreation from "../actions/PanneauCreation";
import { useAuth } from "../context/AuthContext";

const PanneauCreationPage = ({ user }) => {
  const { authUser } = useAuth();
  return (
    <div className="text-black max-w-2xl mx-auto  px-8">
      <PanneauCreation user={authUser} />
    </div>
  );
};

export default PanneauCreationPage;
