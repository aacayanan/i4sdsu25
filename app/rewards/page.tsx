"use client";

import Layout from "../components/Layout";
import { useState } from 'react';
import RewardItems from "../lib/rewardItems";
import RewardConfirm from "../lib/rewardConfirm";
import { useSearchParams } from "next/navigation";

interface Reward {
  id: number;
  icon: string;
  title: string;
  rewardDescription: string;
  hiddenDiscountCode: string;
  isClaimed?: boolean;
}

export default function Rewards() {
  const searchParams = useSearchParams();
  const redeemMode = searchParams.get("redeem") === "true";

  //Sample Rewards Data
  const sampleReward: Reward[] = [
    {
      id: 1,
      icon: '/bcbLogo.png',
      title: 'BCB Coffee',
      rewardDescription:'Get 10% off any medium sized coffee/tea or pastries.',
      hiddenDiscountCode: 'BCB10' 
    },
    {
      id: 2,
      icon: '/pandaLogo.png',
      title: 'Panda Express',
      rewardDescription: 'Get a free appetizer with any entree purchased.',
      hiddenDiscountCode: 'PandaAppetizer2025'
    },
    {
      id: 3,
      icon: '/starbucksLogo.jpg',
      title: 'Starbucks',
      rewardDescription: 'Earn double stars on your next purchase.',
      hiddenDiscountCode: 'StarbucksDoubleStars2025'
    },
    {
      id: 4,
      icon: '/habitGrillLogo.jpeg',
      title: 'Habit Grill',
      rewardDescription: 'Get a free side with any combo meal.',
      hiddenDiscountCode: 'HabitualDiscountedGrillers'
    }
  ]

const [ rewards, setRewards ] = useState<Reward[]>(sampleReward);
const [ isModalOpen, setIsModalOpen ] = useState(false);
const [selectedRewardId, setSelectedRewardId] = useState<number | null>(null);

const handleAddClick = (id: number) => {
  setSelectedRewardId( id );
  setIsModalOpen(true);
};

  const handleConfirmAdd = () => {
    if (selectedRewardId !== null) {
      const confirmedText = '✅ Claimed! Check your app for details.';
      setRewards(prevRewards =>
        prevRewards.map(reward =>
          reward.id === selectedRewardId
            ? { ...reward, isClaimed: true, confirmedText }
            : reward
        )
      );
    }
    closeModal();
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRewardId(null);
  };

    return (
    <Layout>
      <div className="flex justify-center pt-2">
        <div className="w-full max-w-2xl">
          <div className="bg-white rounded-xl p-1 shadow-sm mb-4">
            <h1 className="text-3xl flex justify-center font-semibold text-gray-900 p-1">
              Rewards
            </h1>
          </div>
          
          {/* Use the new component here */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            { rewards.map((reward) => (
              <div key={ reward.id } className="mb-4 last:mb-0">
                <RewardItems
                  rewardData= {{
                    ...reward,
                    isClaimed: reward.isClaimed
                  }}
                  onAddClick={() => handleAddClick(reward.id)}
                  showRedeemedButton={ true }
                  showBottomSection={ redeemMode}
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
        itemName={ rewards.find(r => r.id === selectedRewardId)?.title || '' }
      />
    </Layout>
  );
}