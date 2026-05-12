type Hotel = {
  id: number;
  name: string;
  location: string;
  price: string;
  rating: string;
  matchScore?: number;
  image: string;
};

type SaveButtonProps = {
  hotel: Hotel;
};

function SaveButton({ hotel }: SaveButtonProps) {
  const saveHotel = () => {
    const savedIds: number[] = JSON.parse(
      localStorage.getItem("savedHotels") || "[]"
    );

    if (savedIds.includes(hotel.id)) {
      alert("Hotel already saved");
      return;
    }

    savedIds.push(hotel.id);

    localStorage.setItem("savedHotels", JSON.stringify(savedIds));

    alert("Hotel saved successfully");
  };

  return (
    <button
      onClick={saveHotel}
      className="w-full mt-3 bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 rounded-xl"
    >
      💗 Save Hotel
    </button>
  );
}

export default SaveButton;