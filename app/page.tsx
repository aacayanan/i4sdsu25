"use client";

import Layout from "./components/Layout";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  const [ points, setPoints ] = useState(0);
  const maxPoints = 50;

  const addPoints = () => {
    setPoints((prev) => Math.min(prev + 5, maxPoints));
  };

  const goToRewards = () => {
    if (points >= maxPoints) {
      router.push("/rewards?redeem=true");
    }
  };

  const progressPercent = (points / maxPoints) * 100;
  const progressColor = `rgb(${Math.min(200 + points * 1.1, 255)}, ${
    Math.max(200 - points * 4, 0)
  }, ${Math.max(200 - points * 4, 0)})`;

  return (
    <Layout>
      <div className="flex flex-col items-center gap-6 pt-4">
      {/* Points Card */}
        <div className="w-full max-w-md flex flex-col gap-6">
          <div className="home-container bg-[#ECECEC]">
            <div className="text-center">
              <div className="text-7xl sm:text-8xl font-medium text-black mb-6">
                0
              </div>
              <div className="text-md sm:text-base font-semibold font-medium text-black">
                Points Earned
              </div>
            </div>
          </div>
      {/* END Points Card */}

      {/* Total Recycled Card */}
          <div className="home-container bg-[#A6192E]">
            <div className="text-center">
              <div className="text-7xl sm:text-8xl font-medium text-black mb-6">
                0
              </div>
              <div className="text-md sm:text-base font-semibold font-medium text-black">
                Total Recycled
              </div>
            </div>
          </div>
        {/* END Total Recycled Card */}

        {/* Redeem Progress Bar/Button */}
          <div
            className={`relative w-full h-12 rounded-lg cursor-pointer overflow-hidden shadow-md mt-4 ${
              points >= maxPoints ? "hover:brightness-110" : "cursor-not-allowed" }`}
            onClick={goToRewards}>

            <div className="absolute top-0 left-0 h-full w-full rounded-lg"
              style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}>
            </div>

            <div
              className="absolute top-0 left-0 h-full transition-all duration-500"
              style={{
                width: `${progressPercent}%`,
                backgroundColor: progressColor,
              }}
            ></div>

            {/* Overlay text */}
            <div className="absolute inset-0 flex items-center justify-center font-bold text-white z-10 pointer-events-none">
              {points >= maxPoints ? "Redeem Reward" : `${points}/${maxPoints} Points`}
            </div>
          </div>

          {/* Temp Button to Add Points */}
          <button
            onClick={addPoints}
            className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
            Add 5 Points
          </button>
        </div>
      </div>
    </Layout>
  );
}