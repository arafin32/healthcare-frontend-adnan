// src/components/ui/Avatar.jsx
import * as React from "react";

export const Avatar = ({ children, className }) => {
  return (
    <div className={`rounded-full bg-gray-200 flex items-center justify-center ${className}`}>
      {children}
    </div>
  );
};

export const AvatarFallback = ({ children }) => {
  return <span className="text-gray-700 font-semibold">{children}</span>;
};