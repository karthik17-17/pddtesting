function ComparePage() {
  const compareHotels = JSON.parse(
    localStorage.getItem("compareHotels") || "[]"
  );

  const hotel1 = compareHotels[0];
  const hotel2 = compareHotels[1];

  if (!hotel1 || !hotel2) {
    return (
      <div className="min-h-screen bg-[#071028] text-white flex items-center justify-center">
        <h1 className="text-5xl font-bold">
          No hotels selected for comparison
        </h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#071028] text-white p-8">
      {/* TITLE */}
      <h1 className="text-7xl font-bold text-center">
        Hotel Comparison
      </h1>

      {/* BACK BUTTON */}
      <div className="flex justify-center mt-6">
        <button
          onClick={() => window.history.back()}
          className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold px-8 py-4 rounded-2xl"
        >
          ← Back to Results
        </button>
      </div>

      {/* HOTELS */}
      <div className="grid md:grid-cols-2 gap-8 mt-14">
        {[hotel1, hotel2].map((hotel) => (
          <div
            key={hotel.id}
            className="bg-[#1E293B] border border-gray-700 rounded-3xl overflow-hidden"
          >
            {/* IMAGE */}
            <img
              src={hotel.image}
              alt={hotel.name}
              className="w-full h-72 object-cover"
            />

            <div className="p-8">
              {/* NAME */}
              <h2 className="text-5xl font-bold">
                {hotel.name}
              </h2>

              {/* LOCATION */}
              <p className="text-gray-400 mt-3 text-2xl">
                📍 {hotel.location}
              </p>

              {/* DETAILS */}
              <div className="mt-8 space-y-5">
                <div className="text-2xl">
                  <span className="text-cyan-400 font-bold">
                    Price:
                  </span>{" "}
                  ₹{hotel.price}
                </div>

                <div className="text-2xl">
                  <span className="text-cyan-400 font-bold">
                    Rating:
                  </span>{" "}
                  ⭐ {hotel.rating}
                </div>

                {/* FACILITIES */}
                <div>
                  <span className="text-cyan-400 font-bold text-2xl">
                    Facilities:
                  </span>

                  <div className="flex flex-wrap gap-3 mt-4">
                    {hotel.facilities?.map(
                      (facility: string) => (
                        <div
                          key={facility}
                          className="bg-[#0F172A] border border-gray-700 px-4 py-3 rounded-2xl"
                        >
                          {facility}
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>

              {/* BOOK BUTTON */}
              <button
                onClick={() =>
                  window.open(
                    `https://www.google.com/search?q=${hotel.name} ${hotel.location} booking`,
                    "_blank"
                  )
                }
                className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-4 rounded-2xl mt-8"
              >
                Book Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* AI RECOMMENDATION */}
      <div className="bg-cyan-500 text-black rounded-3xl p-10 mt-12 text-center">
        <h2 className="text-6xl font-bold">
          AI Recommendation
        </h2>

        <p className="text-3xl mt-6 font-semibold">
          {hotel2.name} is recommended because of
          higher ratings, luxury facilities, and
          better overall experience.
        </p>
      </div>
    </div>
  );
}

export default ComparePage;