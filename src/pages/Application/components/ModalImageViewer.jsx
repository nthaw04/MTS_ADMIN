/* eslint-disable react/prop-types */

const ModalImageViewer = ({ isOpen, onClose, imageUrl }) => {
  if (!isOpen || !imageUrl) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="relative bg-white rounded-lg overflow-hidden max-w-3xl w-full shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-white p-1 rounded-full shadow hover:bg-gray-100"
        >
          ✕
        </button>
        <img
          src={imageUrl}
          alt="Preview"
          className="w-full h-auto object-contain max-h-[90vh]"
        />
      </div>
    </div>
  );
};

export default ModalImageViewer;
