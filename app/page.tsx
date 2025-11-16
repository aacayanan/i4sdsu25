"use client";

import Layout from "./components/Layout";
import React, { useEffect, useState } from "react";
import RewardItems from "./lib/rewardItems";
import { supabase } from "./lib/supabase";

export default function Home() {
  const [points, setPoints] = useState(0);
  const [totalRecycled, setTotalRecycled] = useState(0);

  useEffect(() => {
  async function fetchData() {
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id, total_points")
      .eq("username", "green_guru")  
      .single();

    if (profileError || !profile) {
      console.log("Supabase profile error:", profileError);
      return;
    }

    setPoints(profile.total_points ?? 0);

    const { data: recycleRows, error: recycleError } = await supabase
      .from("trash_total")
      .select("recycled")
      .eq("user_id", profile.id);

    if (recycleError) {
      console.log("Supabase trash_total error:", recycleError);
      return;
    }

    const total = (recycleRows || []).reduce(
      (sum, row) => sum + (row.recycled ?? 0),
      0
    );

    setTotalRecycled(total);
  }

  fetchData();
}, []);


  return (
    <Layout>
      <div className="flex flex-col items-center gap-6 pt-4">
      {/* Points Card */}
        <div className="w-full max-w-md">
          <div className="home-container bg-[#ECECEC]">
            <div className="text-center">
              <div className="text-7xl sm:text-8xl font-medium text-black mb-6">
                {points}
              </div>
              <div className="text-sm sm:text-base font-medium text-black">
                Points Earned
              </div>
            </div>
          </div>
      {/* END Points Card */}

      {/* Total Recycled Card */}
          <div className="home-container bg-[#D31635]">
            <div className="text-center">
              <div className="text-7xl sm:text-8xl font-medium text-black mb-6">
                {totalRecycled}
              </div>
              <div className="text-sm sm:text-base font-medium text-black">
                Total Recycled
              </div>
            </div>
          </div>
        {/* END Total Recycled Card */}
        </div>
      </div>
    </Layout>
  );
}