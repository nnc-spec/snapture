import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, Sparkles, Heart, Rocket, Brain } from "lucide-react";

interface TransformationSliderProps {
  value: number;
  onChange: (value: number) => void;
}

export default function TransformationSlider({ value, onChange }: TransformationSliderProps) {
  const intensityLevels = [
    { 
      level: 1, 
      label: "Gentle", 
      description: "Subtle, realistic transformation",
      emoji: "💙",
      color: "bg-blue-50 hover:bg-blue-100 border-blue-200",
      selectedColor: "bg-blue-500 text-white border-blue-500"
    },
    { 
      level: 2, 
      label: "Mild", 
      description: "Light creative touches",
      emoji: "✨",
      color: "bg-green-50 hover:bg-green-100 border-green-200",
      selectedColor: "bg-green-500 text-white border-green-500"
    },
    { 
      level: 3, 
      label: "Playful", 
      description: "Balanced creativity",
      emoji: "⚡",
      color: "bg-yellow-50 hover:bg-yellow-100 border-yellow-200",
      selectedColor: "bg-yellow-500 text-white border-yellow-500"
    },
    { 
      level: 4, 
      label: "Wild", 
      description: "Bold and imaginative",
      emoji: "🚀",
      color: "bg-orange-50 hover:bg-orange-100 border-orange-200",
      selectedColor: "bg-orange-500 text-white border-orange-500"
    },
    { 
      level: 5, 
      label: "Extreme", 
      description: "Maximum creative freedom",
      emoji: "🧠",
      color: "bg-purple-50 hover:bg-purple-100 border-purple-200",
      selectedColor: "bg-purple-500 text-white border-purple-500"
    }
  ];

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-900">AI Transformation Intensity</h3>
        <p className="text-sm text-gray-600">Choose how creatively AI will transform your memory</p>
      </div>
      
      <div className="grid grid-cols-5 gap-2">
        {intensityLevels.map((level) => {
          const isSelected = value === level.level;
          
          return (
            <button
              key={level.level}
              onClick={() => onChange(level.level)}
              className={`p-3 rounded-lg border-2 transition-all duration-200 text-center ${
                isSelected ? level.selectedColor : level.color
              }`}
            >
              <div className="space-y-2">
                <div className="text-lg">
                  {level.emoji}
                </div>
                <div className={`text-xs font-medium ${isSelected ? 'text-white' : 'text-gray-700'}`}>
                  {level.label}
                </div>
              </div>
            </button>
          );
        })}
      </div>
      
      <Card className="p-4 bg-gradient-to-r from-gray-50 to-gray-100">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                Level {value}
              </Badge>
              <span className="text-sm font-medium text-gray-900">
                {intensityLevels[value - 1].label}
              </span>
            </div>
            <p className="text-xs text-gray-600">
              {intensityLevels[value - 1].description}
            </p>
          </div>
          <div className={`p-2 rounded-full ${intensityLevels[value - 1].color}`}>
            <span className="text-lg">
              {intensityLevels[value - 1].emoji}
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}