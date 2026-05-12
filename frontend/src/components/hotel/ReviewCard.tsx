type ReviewCardProps = {
  name: string;
  rating: number;
  comment: string;
};

function ReviewCard({ name, rating, comment }: ReviewCardProps) {
  return (
    <div className="bg-[#1E293B] border border-gray-700 rounded-3xl p-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold">{name}</h3>

        <span className="bg-cyan-500 text-black px-4 py-2 rounded-xl font-bold">
          ⭐ {rating}
        </span>
      </div>

      <p className="text-gray-300 mt-4 leading-7">
        {comment}
      </p>
    </div>
  );
}

export default ReviewCard;