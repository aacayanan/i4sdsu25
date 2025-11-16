import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  itemName: string;
}

const RewardConfirm: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    itemName
}) => {
  return (
    // The Dialog component manages the open state
    <Dialog.Root open={ isOpen } onOpenChange={ onClose }>
      {/* 
        The Dialog.Overlay replaces the fixed background div. 
        Radix handles the backdrop blur and z-index.
      */}
      <Dialog.Overlay className="fixed inset-0 bg-black/20 z-50 backdrop-blur-sm" />
      
      {/* 
        The Dialog.Content replaces your inner modal div. 
        We use a container div to help with centering using fixed positioning.
      */}
      <Dialog.Content className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm m-4">
          
          {/* Use Dialog.Title for semantic accessibility */}
          <Dialog.Title className="text-xl text-black font-semibold mb-4">{ title }</Dialog.Title>
          
          <p className="mb-6 text-black">Are you sure you want to add the { itemName } discount?</p>
          
          <div className="flex justify-end gap-3">
            {/* The Close primitive automatically handles closing the dialog */}
            <Dialog.Close asChild>
              <button
                className="px-4 py-2 border border-gray-300 rounded-md text-black hover:bg-gray-100">
                  Cancel
              </button>
            </Dialog.Close>
            
            <button
              onClick={ onConfirm }
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  Confirm
            </button>
          </div>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default RewardConfirm;