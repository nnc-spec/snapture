import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import type { Memory } from "@shared/schema";

interface GeneratedMemoryProps {
  memory: Memory;
}

export default function GeneratedMemory({ memory }: GeneratedMemoryProps) {
  const { toast } = useToast();
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  
  console.log("GeneratedMemory component received:", memory);
  console.log("Image URL in component:", memory.imageUrl);

  const handleShare = async () => {
    if (navigator.share && memory.imageUrl) {
      try {
        const response = await fetch(memory.imageUrl);
        const blob = await response.blob();
        const file = new File([blob], 'snapture-memory.png', { type: 'image/png' });
        
        await navigator.share({
          title: 'My Snapture Visual Memory',
          text: `Check out this AI-generated memory: "${memory.momentText}"`,
          files: [file]
        });
      } catch (error) {
        // Fallback to URL sharing
        try {
          await navigator.share({
            title: 'My Snapture Visual Memory',
            text: `Check out this AI-generated memory: "${memory.momentText}"`,
            url: window.location.href
          });
        } catch (fallbackError) {
          // User cancelled sharing
        }
      }
    } else if (memory.imageUrl) {
      try {
        await navigator.clipboard.writeText(memory.imageUrl);
        toast({
          title: "Copied!",
          description: "Image URL copied to clipboard",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Could not copy to clipboard",
          variant: "destructive",
        });
      }
    }
  };

  const handleSave = async () => {
    if (!memory.imageUrl) return;
    
    try {
      const response = await fetch(memory.imageUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `snapture-memory-${new Date().toISOString().split('T')[0]}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Downloaded!",
        description: "Visual memory saved to your device",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not download image",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-slide-up memory-card">
      <div className="p-6 space-y-4">
        <div className="flex items-center space-x-2 mb-4">
          <span className="text-2xl">🎨</span>
          <h3 className="text-lg font-semibold text-gray-900">Your Visual Memory</h3>
        </div>
        
        {memory.imageUrl ? (
          <div className="relative">
            {imageLoading && (
              <div className="space-y-3">
                <Skeleton className="w-full h-64 rounded-xl" />
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                  <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                  <span>AI is creating your visual memory...</span>
                </div>
              </div>
            )}
            {imageError && (
              <div className="w-full h-64 bg-gray-100 rounded-xl flex items-center justify-center">
                <div className="text-center space-y-2">
                  <div className="text-2xl">🎨</div>
                  <p className="text-sm text-gray-600">Image generation in progress</p>
                  <p className="text-xs text-gray-500">Please wait a moment...</p>
                </div>
              </div>
            )}
            <img 
              src={memory.imageUrl} 
              alt="AI-generated visual memory"
              className={`w-full h-auto rounded-xl shadow-md transition-opacity duration-300 ${
                imageLoading ? 'opacity-0 absolute' : 'opacity-100'
              }`}
              style={{ maxHeight: '400px', objectFit: 'cover' }}
              onLoad={() => {
                console.log("Image loaded successfully");
                setImageLoading(false);
                setImageError(false);
              }}
              onError={(e) => {
                console.error("Image failed to load:", e);
                console.error("Failed URL:", memory.imageUrl);
                setImageLoading(false);
                setImageError(true);
              }}
            />
            <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
              "{memory.momentText}"
            </div>
          </div>
        ) : (
          <div className="w-full h-64 bg-gray-100 rounded-xl flex items-center justify-center">
            <span className="text-gray-500">Generating visual memory...</span>
          </div>
        )}
        
        {/* Memory Actions */}
        <div className="flex space-x-3 pt-4">
          <Button
            onClick={handleShare}
            variant="outline"
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <span className="text-lg">🔗</span>
            <span>Share</span>
          </Button>
          
          <Button
            onClick={handleSave}
            variant="outline"
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <span className="text-lg">⬇️</span>
            <span>Save</span>
          </Button>
        </div>
      </div>
      
      {/* Watermark for free users */}
      {!memory.isPremium && (
        <div className="bg-gray-50 px-6 py-3 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span className="flex items-center space-x-1">
              <span>Created with</span>
              <span className="font-semibold text-blue-600">Snapture</span>
            </span>
            <span>Free Version</span>
          </div>
        </div>
      )}
    </div>
  );
}
