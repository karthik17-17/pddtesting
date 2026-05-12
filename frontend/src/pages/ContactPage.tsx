function ContactPage() {
  return (
    <div className="min-h-screen bg-[#071028] text-white p-8">
      <h1 className="text-7xl font-bold mb-8">
        Contact Support
      </h1>

      <div className="bg-[#1E293B] border border-gray-700 rounded-3xl p-8 max-w-3xl">
        <p className="text-gray-300 text-xl mb-8">
          Need help with NeuroStay AI? Send us your message.
        </p>

        <form className="space-y-5">
          <input
            type="text"
            placeholder="Your Name"
            className="w-full bg-[#0F172A] border border-gray-700 rounded-2xl px-5 py-4 text-white outline-none"
          />

          <input
            type="email"
            placeholder="Your Email"
            className="w-full bg-[#0F172A] border border-gray-700 rounded-2xl px-5 py-4 text-white outline-none"
          />

          <textarea
            placeholder="Your Message"
            rows={5}
            className="w-full bg-[#0F172A] border border-gray-700 rounded-2xl px-5 py-4 text-white outline-none resize-none"
          ></textarea>

          <button
            type="button"
            onClick={() => alert("Message sent successfully!")}
            className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold px-8 py-4 rounded-2xl"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}

export default ContactPage;