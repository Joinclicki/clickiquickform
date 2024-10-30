import React from 'react';
import { PartyPopper, Gift } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ThankYouModalProps {
  onClose: () => void;
}

export default function ThankYouModal({ onClose }: ThankYouModalProps) {
  React.useEffect(() => {
    // Trigger confetti animation
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white rounded-xl p-6 max-w-sm w-full mx-4 shadow-2xl animate-slideUp">
        <div className="text-center">
          <div className="mb-4 flex justify-center">
            <div className="bg-green-100 p-3 rounded-full">
              <PartyPopper className="w-8 h-8 text-green-600" />
            </div>
          </div>
          
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Thank you! 🎉
          </h3>
          
          <p className="text-gray-600 mb-6">
            We've received your referral and will reach out to your contact right away.
          </p>

          <div className="bg-indigo-50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center gap-2 text-indigo-600 font-medium mb-1">
              <Gift className="w-5 h-5" />
              Your reward is on the way
            </div>
            <p className="text-indigo-700 text-sm">
              Once we verify your referral information
            </p>
          </div>
          
          <button
            onClick={onClose}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium px-6 py-2 rounded-lg transition-colors duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}