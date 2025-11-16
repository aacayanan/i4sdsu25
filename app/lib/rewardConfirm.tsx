import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  itemName: string;
}

const rewardConfirm: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    itemName
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 **bg-black/20** flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm m-4">
        <h2 className="text-xl text-black font-semibold mb-4">{ title }</h2>
        <p className="mb-6 text-black">Are you sure you want to add the { itemName } discount?</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={ onClose }
            className="px-4 py-2 border border-gray-300 rounded-md text-black hover:bg-gray-100">
                Cancel
          </button>
          <button
            onClick={ onConfirm }
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default rewardConfirm;