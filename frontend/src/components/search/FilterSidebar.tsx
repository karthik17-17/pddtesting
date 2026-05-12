function FilterSidebar() {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5 w-72 h-fit">

      <h2 className="text-2xl font-bold mb-6 text-white">
        Filters
      </h2>

      <div className="space-y-5">

        {/* Budget */}
        <div>
          <label className="block text-slate-300 mb-2">
            Budget
          </label>

          <select className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white">
            <option>Any Budget</option>
            <option>Below ₹2000</option>
            <option>₹2000 - ₹5000</option>
            <option>Above ₹5000</option>
          </select>
        </div>

        {/* Rating */}
        <div>
          <label className="block text-slate-300 mb-2">
            Rating
          </label>

          <select className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white">
            <option>Any Rating</option>
            <option>4+ Stars</option>
            <option>3+ Stars</option>
          </select>
        </div>

        {/* Facilities */}
        <div>
          <label className="block text-slate-300 mb-2">
            Facilities
          </label>

          <div className="space-y-3 text-slate-300">

            <div>
              <input type="checkbox" className="mr-2" />
              WiFi
            </div>

            <div>
              <input type="checkbox" className="mr-2" />
              AC
            </div>

            <div>
              <input type="checkbox" className="mr-2" />
              Parking
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default FilterSidebar;