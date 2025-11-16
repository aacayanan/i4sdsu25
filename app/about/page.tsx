import Layout from "../components/Layout";

export default function About() {
  return (
    <Layout>
      <div className="flex justify-center">
        <div className="w-full max-w-2xl">
          <div className="h-full m-2 bg-white rounded-xl p-6 shadow-sm">
            <h1 className="text-3xl underline font-semibold flex justify-center text-gray-900 mb-4">Goal</h1>
            <p className="text-gray-600 leading-relaxed">
              This app helps individuals, whether student or faculty, from SDSU to recycle smarter by recognizing
              items, awarding points, and encouraging eco-friendly habits on schoolgrounds. Our mission is to
              promotes long-term sustainability by making recycling rewarding and fun. Lets keep our campus green!
            </p>
            <img className="rounded-md py-4" src="./greenCampus.jpg" alt="SDSU Green Campus" />
            <hr className="w-full border-t border-gray-300"></hr>
            <h2 className="text-3xl underline text-gray-600 font-semibold flex justify-center text-gray-900 pt-4 mb-4">Accepted Items</h2>
            <ul className="list-disc text-2xl text-black font-serif py-1 px-6 flex align-center flex-col">
              <li className="">Aluminum Cans</li>
              <li className="">Cardboard</li>
              <li className="">Compost</li>
              <li className="">Glass</li>
              <li className="">Paper</li>
              <li className="">Plastic Bottles</li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
}
