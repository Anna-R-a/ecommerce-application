import React from "react";
import ProfileTabs from "../../components/profile-tabs/profileTabs";
import "./Profile.css";

const ProfilePage: React.FC = () => {
  return (
    <div className="container">
      <ProfileTabs />
    </div>
  );
};

export default ProfilePage;
