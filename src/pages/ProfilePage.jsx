import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import ProfileHeader from "../components/users/ProfileHeader";
import EducationSection from "../components/users/EducationSection";
import ExperienceSection from "../components/users/ExperienceSection";
import AboutSection from "../components/users/AboutSection";
import SkillSection from "../components/users/SkillSection";
import MessagesSection from "../components/users/MessagesSection";

const ProfilePage = () => {
  const { username } = useParams();
  const queryClient = useQueryClient();

  const { data: authUser, isLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get("/auth/me"); // protégée par protectRoutes
        return res.data;
      } catch (error) {
        if (error.response?.status === 401) {
          return null; // Pas connecté = valeur authUser null (normal)
        }
        throw error; // Les autres erreurs doivent être remontées
      }
    },
    retry: false,
    refetchOnWindowFocus: false,
  });
  const { data: userProfile, isLoading: isUserProfileLoading } = useQuery({
    queryKey: ["userProfile", username],
    queryFn: async () => {
      const res = await axiosInstance.get(`/users/pr/${username}`);
      return res.data;
    },
    retry: false,
    refetchOnWindowFocus: false,
  });

  const { mutate: updateProfile } = useMutation({
    mutationFn: async (updateData) => {
      const res = await axiosInstance.put(`/users/profile`, updateData);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Profil mis à jour");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      queryClient.invalidateQueries({ queryKey: ["userProfile", username] });
    },
  });

  if (isLoading || isUserProfileLoading) return null;
  const isOwnProfile = authUser?.username === userProfile?.username;
  const userData = isOwnProfile ? authUser : userProfile;

  const handleSave = (updateData) => {
    updateProfile(updateData);
  };

  return (
    <div className="max-w-5xl  text-black mx-auto gap-4 p-4">
      <ProfileHeader
        userData={userData}
        isOwnProfile={isOwnProfile}
        onSave={handleSave}
        authUser={authUser}
      />

      <AboutSection
        userData={userData}
        isOwnProfile={isOwnProfile}
        onSave={handleSave}
      />

      <ExperienceSection
        userData={userData}
        isOwnProfile={isOwnProfile}
        onSave={handleSave}
      />
      <EducationSection
        userData={userData}
        isOwnProfile={isOwnProfile}
        onSave={handleSave}
      />

      <SkillSection
        userData={userData}
        isOwnProfile={isOwnProfile}
        onSave={handleSave}
      />

      <MessagesSection
        userData={userData}
        isOwnProfile={isOwnProfile}
        onSave={handleSave}
         targetUserId={userProfile?._id} 
      />
    </div>
  );
};

export default ProfilePage;
