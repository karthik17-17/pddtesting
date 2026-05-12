function ProjectSummaryPage() {
  const features = [
    "AI Hotel Search",
    "AI Loading Animation",
    "Dynamic Results Page",
    "AI Match Score",
    "Why This Hotel Explanation",
    "Hotel Detail Page",
    "Google Map View",
    "Save Hotel Wishlist",
    "Compare Hotels",
    "Login & Register",
    "Protected Routes",
    "Profile Dashboard",
    "Search History",
    "Contact Page",
    "About Page",
    "404 Page",
  ];

  return (
    <div className="min-h-screen bg-[#071028] text-white p-8">
      <h1 className="text-7xl font-bold mb-6">
        NeuroStay AI Project Summary
      </h1>

      <p className="text-gray-300 text-xl max-w-4xl leading-8">
        NeuroStay AI is a full-stack AI-powered hotel discovery platform.
        It helps users search, compare, save, and explore hotels using a
        modern AI-style interface.
      </p>

      <div className="grid md:grid-cols-3 gap-6 mt-12">
        {features.map((feature) => (
          <div
            key={feature}
            className="bg-[#1E293B] border border-gray-700 rounded-3xl p-6"
          >
            <h2 className="text-2xl font-bold text-cyan-400">
              ✅ {feature}
            </h2>
          </div>
        ))}
      </div>

      <div className="bg-cyan-500 text-black rounded-3xl p-8 mt-12">
        <h2 className="text-4xl font-bold">
          Project Status: Completed
        </h2>

        <p className="text-xl mt-4 font-semibold">
          Frontend, backend, authentication, maps, search, comparison,
          profile, and wishlist features are successfully implemented.
        </p>
      </div>
    </div>
  );
}

export default ProjectSummaryPage;