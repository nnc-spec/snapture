import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import StyleSelector from "./style-selector";
import TransformationSlider from "./transformation-slider";
import type { Memory, GenerateMemoryRequest } from "@shared/schema";

interface MemoryGeneratorProps {
  onMemoryGenerated: (memory: Memory) => void;
  isGenerating: boolean;
  setIsGenerating: (generating: boolean) => void;
}

export default function MemoryGenerator({ 
  onMemoryGenerated, 
  isGenerating, 
  setIsGenerating 
}: MemoryGeneratorProps) {
  const [momentText, setMomentText] = useState("");
  const [selectedStyle, setSelectedStyle] = useState<"nostalgic" | "funny" | "absurd" | "poetic">("poetic");
  const [intensity, setIntensity] = useState(3);
  const { toast } = useToast();

  const generateMutation = useMutation({
    mutationFn: async (data: GenerateMemoryRequest) => {
      const response = await apiRequest("POST", "/api/generate-memory", data);
      return response.json();
    },
    onMutate: () => {
      setIsGenerating(true);
    },
    onSuccess: (memory: Memory) => {
      console.log("Generated memory received:", memory);
      console.log("Image URL:", memory.imageUrl);
      onMemoryGenerated(memory);
      setMomentText("");
      toast({
        title: "Visual Memory Created!",
        description: "AI is generating your artistic image - it will appear momentarily.",
      });
    },
    onError: (error: any) => {
      let title = "Memory Generation Failed";
      let description = "Unable to generate memory. Please try again.";
      
      if (error.message) {
        description = error.message;
      }
      
      toast({
        title,
        description,
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsGenerating(false);
    },
  });

  const handleGenerate = () => {
    if (momentText.length < 10) {
      toast({
        title: "Too Short",
        description: "Please write at least 10 characters about your moment.",
        variant: "destructive",
      });
      return;
    }

    generateMutation.mutate({
      momentText,
      style: selectedStyle,
      intensity,
    });
  };

  return (
    <>
      {/* Moment Input */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4 animate-fade-in">
        <div className="flex items-center space-x-2 mb-4">
          <span className="text-2xl">🧠</span>
          <h2 className="text-lg font-semibold text-gray-900">Write a moment from today:</h2>
        </div>
        
        <div className="relative">
          <Textarea
            value={momentText}
            onChange={(e) => setMomentText(e.target.value)}
            placeholder="Today I walked home in the rain..."
            className="w-full h-32 p-4 border border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400"
            maxLength={200}
          />
          <div className="absolute bottom-3 right-3 text-xs text-gray-400">
            {momentText.length}/200
          </div>
        </div>
      </div>

      {/* Style Selector */}
      <StyleSelector selectedStyle={selectedStyle} onStyleSelect={setSelectedStyle} />

      {/* Transformation Intensity Slider */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
        <TransformationSlider value={intensity} onChange={setIntensity} />
      </div>

      {/* Generate Button */}
      <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
        <Button
          onClick={handleGenerate}
          disabled={momentText.length < 10 || isGenerating}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold py-4 px-6 rounded-xl hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {isGenerating ? (
            <>
              <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
              <span>Creating AI Memory...</span>
            </>
          ) : (
            <>
              <span className="text-xl">✨</span>
              <span>Generate Memory</span>
            </>
          )}
        </Button>
      </div>

      {/* Loading State */}
      {isGenerating && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 animate-slide-up">
          <div className="text-center mb-6">
            <div className="animate-pulse-slow mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto flex items-center justify-center">
                <span className="text-white text-2xl">🔮</span>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Creating your visual memory...</h3>
            <p className="text-sm text-gray-500">AI is transforming your moment into art</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Step 1: Interpreting your moment</p>
                <p className="text-xs text-gray-500">AI is understanding the emotional context and creating a visual description</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 opacity-50">
              <div className="flex-shrink-0 w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-gray-500 text-sm">2</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500">Step 2: Generating artwork</p>
                <p className="text-xs text-gray-400">Creating the final visual representation</p>
              </div>
            </div>

            <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full animate-pulse" style={{ width: '40%' }}></div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
