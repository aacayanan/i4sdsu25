import Layout from "./components/Layout";

export default function Home() {
  return (
    <Layout>
      <div className="flex flex-col items-center gap-6 pt-4">
      {/* Points Card */}
        <div className="w-full max-w-md">
          <div className="home-container bg-[#ECECEC]">
            <div className="text-center">
              <div className="text-7xl sm:text-8xl font-medium text-black mb-6">
                0
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
                0
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