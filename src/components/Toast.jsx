import React, { useEffect } from "react";
import { CheckCircle, XCircle, AlertCircle, X } from "lucide-react";

function Toast({ 
  isOpen, 
  onClose, 
  type = "success", // success, error, warning
  message, 
  duration = 3000 
}) {
  useEffect(() => {
    if (isOpen && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isOpen, duration, onClose]);

  if (!isOpen) return null;

  const icons = {
    success: <CheckCircle className="text-green-500" size={24} />,
    error: <XCircle className="text-red-500" size={24} />,
    warning: <AlertCircle className="text-yellow-500" size={24} />
  };

  const bgColors = {
    success: "bg-green-50 border-green-200",
    error: "bg-red-50 border-red-200",
    warning: "bg-yellow-50 border-yellow-200"
  };

  const textColors = {
    success: "text-green-800",
    error: "text-red-800",
    warning: "text-yellow-800"
  };

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999] animate-slide-in">
      <div className={`${bgColors[type]} border rounded-xl shadow-lg p-4 pr-12 min-w-[320px] max-w-md relative`}>
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition"
        >
          <X size={20} />
        </button>

        {/* Content */}
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className="flex-shrink-0 mt-0.5">
            {icons[type]}
          </div>

          {/* Message */}
          <div className="flex-1">
            <p className={`${textColors[type]} font-medium text-sm leading-relaxed`}>
              {message}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Toast;