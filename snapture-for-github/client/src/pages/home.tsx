import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import MemoryGenerator from "@/components/memory-generator";
import StyleSelector from "@/components/style-selector";
import GeneratedMemory from "@/components/generated-memory";
import PremiumUpgrade from "@/components/premium-upgrade";
import type { Memory } from "@shared/schema";

export default function Home() {
  const [currentMemory, setCurrentMemory] = useState<Memory | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [location] = useLocation();
  const { toast } = useToast();

  // Preserve memory state when returning from checkout
  useEffect(() => {
    const savedMemory = sessionStorage.getItem('currentMemory');
    const hasReturnedFromCheckout = sessionStorage.getItem('returnedFromCheckout');
    
    if (savedMemory) {
      try {
        const memory = JSON.parse(savedMemory);
        setCurrentMemory(memory);
        
        // Show friendly message if user returned from checkout
        if (hasReturnedFromCheckout === 'true') {
          toast({
            title: "Welcome back!",
            description: "Your generated memory is still here and ready to share.",
          });
          sessionStorage.removeItem('returnedFromCheckout');
        }
      } catch (error) {
        console.error('Error parsing saved memory:', error);
        sessionStorage.removeItem('currentMemory');
      }
    }
  }, [toast]);

  // Save memory to session storage when it changes
  useEffect(() => {
    if (currentMemory) {
      sessionStorage.setItem('currentMemory', JSON.stringify(currentMemory));
    }
  }, [currentMemory]);

  const handleMemoryGenerated = (memory: Memory) => {
    setCurrentMemory(memory);
    sessionStorage.setItem('currentMemory', JSON.stringify(memory));
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-md mx-auto px-6 py-4">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-[hsl(var(--brand))] to-[hsl(var(--premium))] rounded-lg flex items-center justify-center">
                <span className="text-white text-lg font-bold">S</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">Snapture</h1>
            </div>
          </div>
          <p className="text-center text-sm text-gray-500 mt-1">Capture today, remember forever</p>
        </div>
      </header>

      <main className="max-w-md mx-auto px-6 py-8 space-y-8">
        {/* Memory Generator */}
        <MemoryGenerator 
          onMemoryGenerated={handleMemoryGenerated}
          isGenerating={isGenerating}
          setIsGenerating={setIsGenerating}
        />

        {/* Generated Memory Display */}
        {currentMemory && (
          <>
            <GeneratedMemory memory={currentMemory} />
            <PremiumUpgrade memoryId={currentMemory.id} />
          </>
        )}

        {/* Recent Memories */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">💫</span>
              <h3 className="text-lg font-semibold text-gray-900">Recent Memories</h3>
            </div>
            <button className="text-sm text-blue-600 font-medium hover:text-blue-700">View All</button>
          </div>
          
          <div className="text-center py-8 text-gray-500">
            <span className="text-4xl mb-2 block">🌙</span>
            <p className="text-sm">No memories yet. Create your first one above!</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-md mx-auto px-6 py-8 text-center">
        <div className="space-y-4">
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
            <a href="#" className="hover:text-gray-700 transition-colors">Privacy</a>
            <a href="#" className="hover:text-gray-700 transition-colors">Terms</a>
            <a href="#" className="hover:text-gray-700 transition-colors">Contact</a>
          </div>
          <p className="text-xs text-gray-400">© 2024 Snapture. Capture today, remember forever.</p>
        </div>
      </footer>
    </div>
  );
}
