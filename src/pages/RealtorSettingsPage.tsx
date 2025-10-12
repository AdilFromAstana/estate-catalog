import React, { useState } from "react";
import { Key } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../AppContext";
import {
  useRealtor,
  useUpdateRealtor,
  useUploadRealtorAvatar,
} from "../hooks/useRealtor";
import AvatarUploader from "../components/AvatarUploader";
import PasswordModal from "../components/PasswordModal";
import RealtorForm from "../components/RealtorForm";

const RealtorSettingsPage: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const { data: realtor, isLoading } = useRealtor(user?.id || "");
  const updateRealtor = useUpdateRealtor(user?.id || "");
  const { mutate: uploadAvatar, isPending } = useUploadRealtorAvatar(user?.id!);

  if (isLoading || !realtor) return <div>Загрузка...</div>;

  const handlePasswordChange = (data: any) => {
    console.log("Change password", data);
    toast.success("Пароль успешно изменён!");
    setShowPasswordModal(false);
  };

  return (
    <div className="max-w-4xl mx-auto md:p-6 md:rounded-lg md:shadow-md space-y-6">
      <AvatarUploader
        avatarUrl={realtor.avatar}
        isPending={isPending}
        onUpload={uploadAvatar}
      />

      <RealtorForm
        realtor={realtor}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        updateRealtor={updateRealtor}
      />

      <div className="flex justify-end pt-4">
        <button
          onClick={() => setShowPasswordModal(true)}
          className="px-6 py-2 border border-yellow-500 text-yellow-600 rounded-md hover:bg-yellow-50 flex items-center"
        >
          <Key size={16} className="mr-2" /> Сменить пароль
        </button>
      </div>

      {showPasswordModal && (
        <PasswordModal
          onClose={() => setShowPasswordModal(false)}
          onSubmit={handlePasswordChange}
        />
      )}
    </div>
  );
};

export default RealtorSettingsPage;
