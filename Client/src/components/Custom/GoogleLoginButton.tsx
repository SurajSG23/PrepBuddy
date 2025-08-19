import React from "react";

interface GoogleLoginButtonProps {
  className?: string;
  onClick?: () => void;
}

const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({ className, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-6 py-2 shadow hover:shadow-md transition ${className}`}
    >
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png"
        alt="Google Logo"
        className="w-5 h-5"
      />
      <span className="text-gray-700 font-medium">Sign in with Google</span>
    </button>
  );
};

export default GoogleLoginButton;
