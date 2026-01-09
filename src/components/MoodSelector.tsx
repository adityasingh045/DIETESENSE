interface MoodOption {
    id: string;
    label: string;
    emoji: string;
    color: string;
  }
  
  interface MoodSelectorProps {
    selectedMood: string;
    onMoodSelect: (mood: string) => void;
  }
  
  const moods: MoodOption[] = [
    { id: 'happy', label: 'Happy', emoji: '😊', color: 'bg-yellow-100 hover:bg-yellow-200 border-yellow-300' },
    { id: 'sad', label: 'Sad', emoji: '😢', color: 'bg-blue-100 hover:bg-blue-200 border-blue-300' },
    { id: 'energetic', label: 'Energetic', emoji: '⚡', color: 'bg-orange-100 hover:bg-orange-200 border-orange-300' },
    { id: 'comfort', label: 'Comfort', emoji: '🍵', color: 'bg-green-100 hover:bg-green-200 border-green-300' },
    { id: 'stressed', label: 'Stressed', emoji: '😓', color: 'bg-pink-100 hover:bg-pink-200 border-pink-300' },
    { id: 'focused', label: 'Focused', emoji: '🧠', color: 'bg-purple-100 hover:bg-purple-200 border-purple-300' },
  ];
  
  export default function MoodSelector({ selectedMood, onMoodSelect }: MoodSelectorProps) {
    return (
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          How are you feeling today?
        </h2>
  
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {moods.map((mood) => (
            <button
              key={mood.id}
              onClick={() => onMoodSelect(mood.id)}
              className={`p-6 rounded-xl border-2 transition-all duration-200 ${
                selectedMood === mood.id
                  ? 'ring-4 ring-blue-500 ring-opacity-50 shadow-lg transform scale-105'
                  : 'shadow-md hover:shadow-lg'
              } ${mood.color}`}
            >
              <div className="text-4xl mb-2">{mood.emoji}</div>
              <div className="font-semibold text-gray-900 text-sm">{mood.label}</div>
            </button>
          ))}
        </div>
      </div>
    );
  }
  