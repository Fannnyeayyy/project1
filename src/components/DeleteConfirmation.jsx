import React from "react";
import { AlertTriangle } from "lucide-react";

function DeleteConfirmation({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Apakah Anda yakin ingin menghapus user ini?",
  message = "Tindakan ini akan menghapus user secara permanen dan tidak dapat dibatalkan."
}) {
  if (!isOpen) return null;

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
          {title}
        </h2>

        {/* Message */}
        <p className="text-gray-600 text-center text-sm mb-8">
          {message}
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
            onClick={onClose}
            className="flex-1 bg-white hover:bg-gray-100 text-gray-800 font-semibold py-3 rounded-xl transition shadow-lg"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteConfirmation;