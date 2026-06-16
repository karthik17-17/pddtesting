import { useToast } from "../../context/ToastContext";

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
  const { success, warning } = useToast();

  const saveHotel = () => {
    const savedIds: number[] = JSON.parse(
      localStorage.getItem("savedHotels") || "[]"
    );

    if (savedIds.includes(hotel.id)) {
      warning("Already Saved", `${hotel.name} is already in your saved list.`);
      return;
    }

    savedIds.push(hotel.id);
    localStorage.setItem("savedHotels", JSON.stringify(savedIds));
    success("Hotel Saved! ❤️", `${hotel.name} has been added to your saved list.`);
  };

  return (
    <button
      onClick={saveHotel}
      className="w-full mt-3 bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 rounded-xl transition"
    >
      💗 Save Hotel
    </button>
  );
}

export default SaveButton;