import React from 'react';
import { PlusCircledIcon, CheckCircledIcon, ClipboardCopyIcon } from '@radix-ui/react-icons';

interface RewardItemProps {
  rewardData: {
    icon: string;
    title: string;
    rewardDescription: string;
    hiddenDiscountCode: string;
    isClaimed?: boolean;
  };
  onAddClick: () => void;
}

const RewardItems: React.FC<RewardItemProps> = ({ rewardData, onAddClick}) => {
  const handleCopyCode = () => {
    navigator.clipboard.writeText(rewardData.hiddenDiscountCode);
    alert('Discount code copied to clipboard!');
  };

  return (
    <div className="flex flex-col border border-gray-200 rounded-xl shadow-sm">
      {/* TOP SECTION */}
      <div className="top-container flex">
        <div className="sub-boxes flex items-center justify-center w-20 h-20 bg-gray-200 rounded-tl-lg">
          <img src={ rewardData.icon } alt={ rewardData.title } className="w-full h-full object-cover rounded-tl-lg" />
        </div>
        <div className="sub-boxes flex-1 bg-gray-100 rounded-tr-lg h-20 flex items-center p-4">
          <h2 className="text-xl font-semibold">{ rewardData.title }</h2>
        </div>
      </div>

      {/* MID SECTION */}
      <div className="mid-container flex">
        <div className="sub-boxes flex-1 bg-gray-100 h-11 text-m p-4">
            {rewardData.isClaimed ? (
                <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-green-600">
                        Code: { rewardData.hiddenDiscountCode }
                    </p>
                    <button
                        onClick={ handleCopyCode }
                        className="flex items-center gap-2 text-xs text-blue-600 hover:text-blue-800 ml-4">
                        <ClipboardCopyIcon className="icon w-3 h-3" />
                        Copy
                    </button>
                </div>
            ) : (
                <p className="text-sm text-gray-600">{ rewardData.rewardDescription }</p>
            )}
        </div>
      </div>
      {/* END MID SECTION */}

      {/* BOTTOM SECTION */}
      <div className="bottom-container flex">
        <button
          onClick={ onAddClick }
          disabled={ rewardData.isClaimed } 
          className={`sub-boxes w-20 h-10 rounded-bl-lg flex items-center justify-center text-sm font-medium ${
            rewardData.isClaimed 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-gray-300 hover:bg-gray-400'
          }`}
        >
          {rewardData.isClaimed ? (
            <CheckCircledIcon className="w-5 h-5 text-white" />
          ) : (
            <PlusCircledIcon className="w-5 h-5" />
          )}
          { rewardData.isClaimed ? 'CLAIMED' : '' }
        </button>
        <div className={`sub-boxes flex-1 rounded-br-lg h-10 items-center p-4 ${ rewardData.isClaimed ? 'bg-green-100' : 'bg-gray-100' }`}>
          <p className={`text-xs ${ rewardData.isClaimed ? 'text-green-800 font-semibold' : 'text-gray-500' }`}>
            {rewardData.isClaimed ? 'Code revealed above.' : 'Tap the ADD icon to claim this reward.'}
          </p>
        </div>
      </div>
      {/* END BOTTOM SECTION */}
    </div>
  );
};

export default RewardItems;