type MatchScoreProps = {
  score: number;
};

function MatchScore({ score }: MatchScoreProps) {
  return (
    <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-400 text-cyan-300 px-3 py-2 rounded-xl font-bold">
      AI Match: {score}%
    </div>
  );
}

export default MatchScore;