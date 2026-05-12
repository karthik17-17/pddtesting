function MapView() {
  return (
    <div className="w-full h-[500px] rounded-2xl overflow-hidden border border-cyan-500">
      <iframe
        title="Google Map"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        loading="lazy"
        allowFullScreen
        src="https://maps.google.com/maps?q=Chennai&t=&z=13&ie=UTF8&iwloc=&output=embed"
      ></iframe>
    </div>
  );
}

export default MapView;