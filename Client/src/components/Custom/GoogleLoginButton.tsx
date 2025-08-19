import * as React from "react";
import { useThemeSelector } from "../../store/hooks";

interface GoogleLoginButtonProps {
  className?: string;
  onClick?: () => void;
}

const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({ className, onClick }) => {
  const darkMode = useThemeSelector((state) => state.theme.darkMode);
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-6 py-2 rounded-lg border shadow transition font-medium
        ${darkMode ? 
          "bg-gray-900 border-gray-600 text-white hover:bg-gray-800 hover:shadow-indigo-500/20" : 
          "bg-white border-gray-300 text-gray-700 hover:bg-gray-100 hover:shadow-md"}
        ${className || ""}`}
    >
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png"
        alt="Google Logo"
        className="w-5 h-5"
      />
      <span className={darkMode ? "text-white font-medium" : "text-gray-700 font-medium"}>Sign in with Google</span>
    </button>
  );
};

export default GoogleLoginButton;
