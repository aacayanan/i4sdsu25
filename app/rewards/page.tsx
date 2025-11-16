"use client";

import Layout from "../components/Layout";
import React, { useState } from 'react';
import RewardItems from "../lib/rewardItems";
import RewardConfirm from "../lib/rewardConfirm";

export default function Rewards() {

const [ isModalOpen, setIsModalOpen ] = useState(false);
const [ isConfirmed, setIsConfirmed ] = useState({id: null as number | null, title: ''});

const handleAddClick = (id: number, title: string) => {
  setIsConfirmed({ id, title });
  setIsModalOpen(true);
};

  const handleConfirmAdd = () => {
    if (isConfirmed.id !== null) {
      alert(`✅ Confirmed adding: ${isConfirmed.title}`);
      // Add logic here to actually process the reward addition (API call, state update, etc.)
    }
    closeModal();
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setIsConfirmed({ id: null, title: '' });
  };


  const sampleReward = [
    {
      id: 1,
      icon: '/public/bcbLogo.png',
      title: 'BCB Coffee',
      rewardDescription:'Get 10% off any medium sized coffee/tea or pastries.'
    },
    {
      id: 2,
      icon: '/public/pandaLogo.png',
      title: 'Panda Express',
      rewardDescription: 'Get a free appetizer with any entree purchase.'
    },
    {
      id: 3,
      icon: '/public/starbucksLogo.png',
      title: 'Starbucks',
      rewardDescription: 'Earn double stars on your next purchase.'
    },
    {
      id: 4,
      icon: '/public/habitgrillLogo.png',
      title: 'Habit Grill',
      rewardDescription: 'Get a free side with any combo meal.'
    }
]

    return (
    <Layout>
      <div className="flex justify-center pt-4">
        <div className="w-full max-w-2xl">
          <div className="bg-white rounded-xl p-8 shadow-sm mb-4">
            <h1 className="text-3xl font-semibold text-gray-900 mb-4">
              Rewards
            </h1>
          </div>
          
          {/* Use the new component here */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            { sampleReward.map((reward) => (
              <div key={ reward.id } className="mb-4 last:mb-0">
                <RewardItems
                  icon={reward.icon}
                  title={reward.title}
                  rewardDescription={reward.rewardDescription}
                  onAddClick={() => handleAddClick(reward.id, reward.title)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
            
      <RewardConfirm
        isOpen={ isModalOpen }
        onClose={ closeModal }
        onConfirm={ handleConfirmAdd }
        title="Confirmation Required"
        itemName={ isConfirmed.title }
      />
    </Layout>
  );
}