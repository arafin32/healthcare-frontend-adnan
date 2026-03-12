// src/components/ui/button.jsx
import React from "react";

export function Button({ children, variant = "default", className = "", ...props }) {
  const baseClass = "px-4 py-2 rounded font-medium";
  const variantClass =
    variant === "outline"
      ? "bg-transparent border border-gray-400 text-gray-800 hover:bg-gray-100"
      : "bg-blue-600 text-white hover:bg-blue-700";

  return (
    <button className={`${baseClass} ${variantClass} ${className}`} {...props}>
      {children}
    </button>
  );
}