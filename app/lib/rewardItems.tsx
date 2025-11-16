import React from 'react';

// Define a type/interface for the props the component will accept
interface RewardItemProps {
  icon: React.ReactNode;
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
        <div className="sub-boxes flex items-center justify-center w-20 h-20 bg-gray-200 rounded-tl-lg">
          { icon }
        </div>

        {/* Right long bar */}
        <div className="sub-boxes flex-1 bg-gray-100 rounded-tr-lg h-20 flex items-center p-4">
          <h2 className="text-lg font-semibold">{ title }</h2>
        </div>
      </div>

      {/* BOTTOM SECTION */}
      <div className="bottom-container flex">
        <button
          onClick={ onAddClick }
          className="sub-boxes w-20 h-10 bg-gray-300 hover:bg-gray-400 rounded-bl-lg flex items-center justify-center text-sm font-medium"
        >
          ADD
        </button>
        <div className="sub-boxes flex-1 bg-gray-100 rounded-br-lg h-10 flex items-center p-4">
          <p className="text-xs text-gray-500">{ rewardDescription }</p>
        </div>
      </div>
      {/* END BOTTOM SECTION */}
    </div>
    // END Container for top + bottom
  );
};

export default RewardItem;