import React from "react";
import { AlertTriangle } from "lucide-react";

function DeleteConfirmation({ 
  isOpen, 
  onClose,
  onCancel,
  onConfirm, 
  item = "item",
  title,
  message
}) {
  if (!isOpen) return null;

  // Default title dan message
  const defaultTitle = title || `Apakah Anda yakin ingin menghapus ${item} ini?`;
  const defaultMessage = message || `Tindakan ini akan menghapus ${item} secara permanen dan tidak dapat dibatalkan.`;

  // Handle cancel - bisa dari onClose atau onCancel
  const handleCancel = onCancel || onClose;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 transform transition-all scale-100">
        {/* Icon Warning */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="text-red-600" size={32} />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-gray-800 text-center mb-3">
          {defaultTitle}
        </h2>

        {/* Message */}
        <p className="text-gray-600 text-center text-sm mb-8">
          {defaultMessage}
        </p>

        {/* Buttons */}
        <div className="flex gap-4">
          {/* Delete Button */}
          <button
            onClick={onConfirm}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-xl transition shadow-lg"
          >
            Delete
          </button>

          {/* Cancel Button */}
          <button
            onClick={handleCancel}
            className="flex-1 bg-white hover:bg-gray-100 text-gray-800 font-semibold py-3 rounded-xl transition shadow-lg border border-gray-300"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteConfirmation;