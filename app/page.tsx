import Layout from "./components/Layout";

//Screen Dimension on Chrome Inspect Element is 320px x 568px

export default function Home() {
  return (
    <Layout>
      <div className="flex justify-center pt-4">
        <div className="w-full max-w-md">
          <div className="bg-[#ECECEC] rounded-xl p-8 sm:p-12 flex flex-col items-center justify-center shadow-sm">
            <div className="text-center">
              <div className="text-7xl sm:text-8xl font-medium text-black mb-6">
                0
              </div>
              <div className="text-sm sm:text-base font-medium text-black">
                Points Earned
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}