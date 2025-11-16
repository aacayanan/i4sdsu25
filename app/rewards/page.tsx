"use client";

import Layout from "../components/Layout";

export default function Rewards() {
  return (
    <Layout>
      <div className="flex justify-center pt-4">
        <div className="w-full max-w-2xl">
          <div className="bg-white rounded-xl p-8 shadow-sm">
            <h1 className="text-3xl font-semibold text-gray-900 mb-4">
              Rewards
            </h1>
            <p className="text-gray-600 leading-relaxed">
              This page is a placeholder. Continue prompting to add content here.
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">

            {/* Container for top + bottom */}
            <div className="flex flex-col">
              {/* TOP SECTION */}
              <div className="top-container flex">
                {/* Left square */}
                <div className="sub-boxes w-20 h-20 bg-gray-200 rounded-tl-lg">
                  ICON
                </div>

                {/* Right long bar */}
                <div className="sub-boxes flex-1 bg-gray-100 rounded-tr-lg h-20">
                  TITLE
                </div>
              </div>

              {/* MID SECTION */}
              <div className="mid-container flex">
                <div className="sub-boxes flex-1 bg-gray-100 rounded-br-lg h-20">
                  DESCRIPTION
                </div>
              </div>
              {/* END MID SECTION */}

              {/* BOTTOM SECTION */}
              <div className="bottom-container flex">
                <div className="sub-boxes w-15 h-10 bg-gray-200 rounded-bl-lg">
                  ADD
                </div>
                <div className="sub-boxes flex-1 bg-gray-100 rounded-br-lg h-10">
                  REWARD DESCRIPTION
                </div>
              </div>
              {/* END BOTTOM SECTION */}
            </div>
            {/* END Container for top + bottom */}
          </div>
        </div>
      </div>
    </Layout>
  )
}