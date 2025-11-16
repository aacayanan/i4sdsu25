"use client";
import Layout from "./components/Layout";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "./lib/supabase";
import { se } from "date-fns/locale";
import { set } from "date-fns";

const USERNAME = "green_guru";
const POINTS_PER_ITEM = 5;
const MAX_POINTS = 100;

export default function Home() {
  const router = useRouter();

  const [ points, setPoints ] = useState<number | null>(null);
  const [ progress, setProgress ] = useState<number>(0);
  const [ totalRecycled, setTotalRecycled ] = useState<number | null>(null);


  const safePoints = points ?? 0;
  const safeTotalRecycled = totalRecycled ?? 0;

  // Fetch values from Supabase
  useEffect(() => {
    async function loadData() {
      
      //Get user
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id")
        .eq("username", USERNAME)
        .single();

      if (profileError || !profile) {
        console.log("Profile fetch error:", profileError);
        return;
      }

      // Get all recycled trash 
      const { data: trashRows, error: trashError } = await supabase
        .from("trash_total")
        .select("recycled")
        .eq("user_id", profile.id);

      const { data: totalPoints, error: pointsError } = await supabase
        .from("trash_total")
        .select("total_points")
        .eq("user_id", profile.id)
        .single();

      const { data: progressPoints, error: progressError } = await supabase
        .from("trash_total")
        .select("progress_points")
        .eq("user_id", profile.id)
        .single();

      if (trashError) {
        console.log("Trash fetch error:", trashError);
        return;
      }

      // Total recycled
      const total = (trashRows ?? []).reduce(
        (sum, row) => sum + (row.recycled ?? 0),
        0
      );

      // setTotalRecycled(totalPoints);

      // Points = total recycled × 5
      const calculatedPoints = total * POINTS_PER_ITEM;
      setProgress(progressPoints?.progress_points);
      setPoints(totalPoints?.total_points ?? 0);
    }

    loadData();
  }, []);

  // Progress bar logic
  const progressPercent = Math.min(100, (safePoints / MAX_POINTS) * 100);
  const progressColor = `rgb(${Math.min(200 + safePoints * 1.1, 255)}, ${
    Math.max(200 - safePoints * 4, 0)
  }, ${Math.max(200 - safePoints * 4, 0)})`;

  const goToRewards = async () => {
    router.push("/rewards?redeem=true");
    

    // if (safePoints >= MAX_POINTS) {
    //   const { error } = await supabase
    //   .from("trash_total")
    //   .update({ total_points: 0 })
    //   .eq("user_id", USERNAME); // <-- Make sure user_id is correct
    
    //   if (error) {
    //     console.log("Error resetting points:", error);
    //     return;
    //   }
    // }
  };

  return (
    <Layout>
      <div className="flex flex-col items-center gap-6 pt-4">
        {/* Points Card */}
        <div className="w-full max-w-md flex flex-col gap-6">
          <div className="home-container bg-[#ECECEC]">
            <div className="text-center">
              <div className="text-7xl sm:text-8xl font-medium text-black mb-6">
                {points}
              </div>
              <div className="text-md sm:text-base font-semibold font-medium text-black">
                Lifetime Points Earned
              </div>
            </div>
          </div>
        </div>
        {/* END Points Card */}

        {/* Total Recycled Card */}
        <div className="w-full max-w-md flex flex-col gap-6">
          <div className="home-container bg-[#A6192E]">
            <div className="text-center">
              <div className="text-7xl sm:text-8xl font-medium text-black mb-6">
                { safePoints/5 }
              </div>
              <div className="text-md sm:text-base font-semibold font-medium text-black">
                Total Recycled
              </div>
            </div>
          </div>
        </div>
        {/* END Total Recycled Card */}

        {/* Redeem Progress Bar/Button */}
          <div className={`relative w-full h-12 rounded-lg cursor-pointer overflow-hidden shadow-md mt-4 ${
              safePoints >= MAX_POINTS ? "hover:brightness-110" : "cursor-not-allowed" }`}
              onClick={ goToRewards }>
            <div className="absolute top-0 left-0 h-full w-full rounded-lg"
              style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}>
            </div>

            <div
              className="absolute top-0 left-0 h-full transition-all duration-500"
              style={{
                width: `${ progressPercent }%`,
                backgroundColor: progressColor,
              }}>
          </div>

          {/* Overlay text */}
          <div className="absolute inset-0 flex items-center justify-center font-bold text-white z-10 pointer-events-none">
            {progress >= MAX_POINTS ? "Redeem Reward" : `${ progress }/${ MAX_POINTS } Points`}
          </div>
        </div>
      </div>
    </Layout>
  );
}