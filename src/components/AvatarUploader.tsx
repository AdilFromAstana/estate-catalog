import { Upload } from "lucide-react";
import SafeImage from "./SafeImage";

interface AvatarUploaderProps {
  avatarUrl?: string; // может быть undefined
  isPending: boolean;
  onUpload: (file: File) => void;
}

const AvatarUploader: React.FC<AvatarUploaderProps> = ({
  avatarUrl,
  isPending,
  onUpload,
}: any) => {
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    onUpload(file);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <SafeImage srcPath={avatarUrl} />
        {isPending && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full">
            <svg
              className="animate-spin h-6 w-6 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
          </div>
        )}
        <label className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-2 cursor-pointer hover:bg-blue-700">
          <Upload size={16} className="text-white" />
          <input
            type="file"
            accept="image/*"
            onChange={handleFile}
            className="hidden"
            disabled={isPending}
          />
        </label>
      </div>
    </div>
  );
};

export default AvatarUploader;
