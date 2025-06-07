import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

interface PremiumUpgradeProps {
  memoryId: number;
}

export default function PremiumUpgrade({ memoryId }: PremiumUpgradeProps) {
  const [, setLocation] = useLocation();

  const handleUnlockSingle = () => {
    // Ensure memory is saved before navigating to checkout
    sessionStorage.setItem('navigatingToCheckout', 'true');
    setLocation(`/checkout?type=single&memoryId=${memoryId}`);
  };

  const handleGoPremium = () => {
    // Ensure memory is saved before navigating to checkout
    sessionStorage.setItem('navigatingToCheckout', 'true');
    setLocation("/checkout?type=premium");
  };

  return (
    <div className="premium-gradient rounded-2xl shadow-lg p-6 text-white text-center animate-slide-up" style={{ animationDelay: "0.1s" }}>
      <div className="mb-4">
        <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full mx-auto flex items-center justify-center mb-3">
          <span className="text-2xl">👑</span>
        </div>
        <h3 className="text-xl font-bold mb-2">Want to download in HD & save forever?</h3>
        <p className="text-sm opacity-90">Remove watermarks and unlock unlimited memories</p>
        <div className="mt-3 p-2 bg-white bg-opacity-10 rounded-lg">
          <p className="text-xs opacity-80">💾 Your memory will be safely preserved during checkout</p>
        </div>
      </div>
      
      <div className="space-y-3">
        <Button
          onClick={handleUnlockSingle}
          className="w-full bg-white text-purple-600 font-semibold py-3 px-6 rounded-xl hover:bg-gray-50 transition-all duration-200 hover:scale-[1.02]"
        >
          Unlock for €0.99
        </Button>
        
        <Button
          onClick={handleGoPremium}
          variant="outline"
          className="w-full bg-white bg-opacity-20 text-white font-semibold py-3 px-6 rounded-xl hover:bg-opacity-30 transition-all duration-200 border border-white border-opacity-30"
        >
          <div className="flex items-center justify-center space-x-2">
            <span>Go Premium – €4.99/month</span>
            <span className="text-xs bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full font-medium">Popular</span>
          </div>
        </Button>
      </div>
      
      <div className="mt-4 pt-4 border-t border-white border-opacity-20">
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="flex items-center space-x-2">
            <span className="text-green-300">✓</span>
            <span>Unlimited memories</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-green-300">✓</span>
            <span>HD downloads</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-green-300">✓</span>
            <span>No watermarks</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-green-300">✓</span>
            <span>Save history</span>
          </div>
        </div>
      </div>
    </div>
  );
}
