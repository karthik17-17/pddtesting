function AboutPage() {
  return (
    <div className="min-h-screen w-full bg-[#071028] text-white p-6 md:p-8 lg:p-10">
      <h1 className="text-7xl font-bold mb-8">
        About NeuroStay AI
      </h1>

      <div className="bg-[#1E293B] border border-gray-700 rounded-3xl p-8 w-full max-w-7xl">
        <p className="text-gray-300 text-xl leading-9">
          NeuroStay AI is an AI-powered hotel discovery platform.
          It helps users find hotels based on budget, location,
          facilities, reviews, ratings, and personal preferences.
        </p>

        <div className="grid md:grid-cols-3 gap-6 mt-10">
          <div className="bg-[#0F172A] p-6 rounded-2xl border border-gray-700">
            <h2 className="text-2xl font-bold text-cyan-400">
              AI Search
            </h2>
            <p className="text-gray-300 mt-3">
              Users can search hotels using normal language.
            </p>
          </div>

          <div className="bg-[#0F172A] p-6 rounded-2xl border border-gray-700">
            <h2 className="text-2xl font-bold text-cyan-400">
              Smart Matching
            </h2>
            <p className="text-gray-300 mt-3">
              Hotels are ranked using AI match scores.
            </p>
          </div>

          <div className="bg-[#0F172A] p-6 rounded-2xl border border-gray-700">
            <h2 className="text-2xl font-bold text-cyan-400">
              User Features
            </h2>
            <p className="text-gray-300 mt-3">
              Save hotels, compare hotels, view maps, and track searches.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;