interface StyleSelectorProps {
  selectedStyle: "nostalgic" | "funny" | "absurd" | "poetic";
  onStyleSelect: (style: "nostalgic" | "funny" | "absurd" | "poetic") => void;
}

const styles = [
  { key: "nostalgic" as const, emoji: "✨", label: "Nostalgic" },
  { key: "funny" as const, emoji: "😄", label: "Funny" },
  { key: "absurd" as const, emoji: "🎭", label: "Absurd" },
  { key: "poetic" as const, emoji: "🌙", label: "Poetic" },
];

export default function StyleSelector({ selectedStyle, onStyleSelect }: StyleSelectorProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4 animate-fade-in" style={{ animationDelay: "0.1s" }}>
      <div className="flex items-center space-x-2 mb-4">
        <span className="text-2xl">🌀</span>
        <h2 className="text-lg font-semibold text-gray-900">How would you like to remember it?</h2>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {styles.map((style) => (
          <button
            key={style.key}
            onClick={() => onStyleSelect(style.key)}
            className={`p-4 border-2 rounded-xl text-center transition-all duration-200 hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 hover:scale-[1.02] ${
              selectedStyle === style.key
                ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white border-transparent shadow-lg"
                : "border-gray-200 text-gray-700 hover:bg-gray-50"
            }`}
          >
            <div className="text-2xl mb-2">{style.emoji}</div>
            <div className="text-sm font-medium">{style.label}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
