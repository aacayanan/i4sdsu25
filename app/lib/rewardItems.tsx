import React from 'react';
import { PlusCircledIcon } from '@radix-ui/react-icons';

// Define a type/interface for the props the component will accept
interface RewardItemProps {
  icon: string;
  title: string;
  rewardDescription: string;
  onAddClick: () => void;
}

const RewardItem: React.FC<RewardItemProps> = ({
  icon,
  title,
  rewardDescription,
  onAddClick,
}) => {
  return (
    // Container for top + bottom
    <div className="flex flex-col border border-gray-200 rounded-xl shadow-sm">
      {/* TOP SECTION */}
      <div className="top-container flex">
        {/* Left square */}
        <div className="sub-boxes w-20 h-20 bg-gray-200 rounded-tl-lg">
          <img className="bg-center rounded-tl-lg bg-contain"src={ icon } alt={ title } />
        </div>

        {/* Right long bar */}
        <div className="sub-boxes flex-1 bg-gray-100 rounded-tr-lg h-20 p-4">
          <h2 className="text-lg font-semibold">{ title }</h2>
        </div>
      </div>

      {/* BOTTOM SECTION */}
      <div className="bottom-container flex">
        <button
          onClick={ onAddClick }
          className="sub-boxes w-20 h-10 bg-gray-10 hover:bg-gray-400 cursor-pointer rounded-bl-lg text-sm font-medium">
          <PlusCircledIcon width={ 30 } height={ 30 } />
        </button>
        <div className="sub-boxes flex-1 bg-gray-100 rounded-br-lg h-10 p-4">
          <p className="text-m text-black">{ rewardDescription }</p>
        </div>
      </div>
      {/* END BOTTOM SECTION */}
    </div>
    // END Container for top + bottom
  );
};

export default RewardItem;