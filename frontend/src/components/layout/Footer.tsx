function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-8 py-10">
        <div className="grid md:grid-cols-3 gap-10">
          {/* BRAND */}
          <div>
            <h2 className="text-3xl font-bold text-white">
              NeuroStay AI
            </h2>

            <p className="text-slate-400 mt-4 leading-7">
              AI-powered hotel recommendation platform
              that helps users discover hotels based on
              budget, facilities, ratings, and location.
            </p>
          </div>

          {/* LINKS */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">
              Quick Links
            </h3>

            <div className="flex flex-col gap-3 text-slate-400">
              <a href="/">Home</a>
              <a href="/results">Results</a>
              <a href="/saved">Saved</a>
              <a href="/compare">Compare</a>
              <a href="/contact">Contact</a>
            </div>
          </div>

          {/* CONTACT */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">
              Contact
            </h3>

            <div className="text-slate-400 space-y-3">
              <p>Email: support@neurostay.ai</p>
              <p>Phone: +91 9876543210</p>
              <p>Location: Chennai, India</p>
            </div>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="border-t border-slate-800 mt-10 pt-6 text-center text-slate-500">
          © 2026 NeuroStay AI. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;