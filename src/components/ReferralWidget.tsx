import React, { useState, useEffect, createRef } from "react";
import { X, DollarSign, Gift, MapPin, ArrowLeft } from "lucide-react";
import ThankYouModal from "./ThankYouModal";

// Add Google Maps types
declare global {
  interface Window {
    google: {
      maps: {
        places: {
          Autocomplete: new (
            input: HTMLInputElement,
            options?: {
              types?: string[];
              componentRestrictions?: { country: string };
            }
          ) => {
            addListener: (event: string, callback: () => void) => void;
            getPlace: () => {
              formatted_address?: string;
              address_components?: Array<{
                long_name: string;
                short_name: string;
                types: string[];
              }>;
            };
          };
        };
      };
    };
  }
}

interface FormData {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  referralFirstName: string;
  referralLastName: string;
  referralPhone: string;
  referralAddress: string;
  referralCity: string;
  referralState: string;
  referralPostalCode: string;
}

interface WidgetConfig {
  buttonColor?: string;
  youtubeVideoId?: string;
  headerText?: string;
  rewardText?: string;
  webhookUrl2?: string;
  onSubmit?: (formData: FormData) => Promise<void>;
  collectRefereeAddress?: boolean;
}

const INITIAL_FORM_DATA: FormData = {
  firstName: "",
  lastName: "",
  phoneNumber: "",
  referralFirstName: "",
  referralLastName: "",
  referralPhone: "",
  referralAddress: "",
  referralCity: "",
  referralState: "",
  referralPostalCode: "",
};

const DEFAULT_CONFIG: WidgetConfig = {
  buttonColor: "#4F46E5",
  youtubeVideoId: "dQw4w9WgXcQ", // Temporary YouTube video ID
  headerText: "Refer a business to Clicki Referrals!",
  rewardText: "Earn $25 per referral",
  webhookUrl2: "",
  collectRefereeAddress: true,
};

export default function ReferralWidget({
  config = {},
}: {
  config?: WidgetConfig;
}) {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  const [isOpen, setIsOpen] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const autocompleteInputRef = createRef<HTMLInputElement>();

  const formRef = createRef<HTMLFormElement>();

  useEffect(() => {
    const checkHash = () => {
      if (window.location.hash === "#referral") {
        setIsOpen(true);
      }
    };

    checkHash();
    window.addEventListener("hashchange", checkHash);
    return () => window.removeEventListener("hashchange", checkHash);
  }, []);

  useEffect(() => {
    // Load Google Places API
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (autocompleteInputRef.current && window.google) {
      const autocomplete = new window.google.maps.places.Autocomplete(
        autocompleteInputRef.current,
        {
          types: ["address"],
          componentRestrictions: { country: "us" },
        }
      );

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (place.address_components) {
          let streetNumber = "";
          let route = "";
          let city = "";
          let state = "";
          let postalCode = "";

          place.address_components.forEach((component) => {
            if (component.types.includes("street_number")) {
              streetNumber = component.long_name;
            }
            if (component.types.includes("route")) {
              route = component.long_name;
            }
            if (component.types.includes("locality")) {
              city = component.long_name;
            }
            if (component.types.includes("administrative_area_level_1")) {
              state = component.short_name;
            }
            if (component.types.includes("postal_code")) {
              postalCode = component.long_name;
            }
          });

          setFormData((prev) => ({
            ...prev,
            referralAddress: `${streetNumber} ${route}`.trim(),
            referralCity: city,
            referralState: state,
            referralPostalCode: postalCode,
          }));
        }
      });
    }
  }, [autocompleteInputRef.current]);

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      if (finalConfig.webhookUrl2) {
        const url = finalConfig.webhookUrl2
          .replace("{firstName}", encodeURIComponent(formData.firstName))
          .replace("{lastName}", encodeURIComponent(formData.lastName))
          .replace("{phoneNumber}", encodeURIComponent(formData.phoneNumber))
          .replace(
            "{referralFirstName}",
            encodeURIComponent(formData.referralFirstName)
          )
          .replace(
            "{referralLastName}",
            encodeURIComponent(formData.referralLastName)
          )
          .replace(
            "{referralPhone}",
            encodeURIComponent(formData.referralPhone)
          )
          .replace(
            "{referralAddress}",
            encodeURIComponent(formData.referralAddress)
          )
          .replace("{referralCity}", encodeURIComponent(formData.referralCity))
          .replace(
            "{referralState}",
            encodeURIComponent(formData.referralState)
          )
          .replace(
            "{referralPostalCode}",
            encodeURIComponent(formData.referralPostalCode)
          );

        new Image().src = url;
      }

      if (finalConfig.onSubmit) {
        await finalConfig.onSubmit(formData);
      }
    } catch (error) {
      console.log("Request completed");
    } finally {
      setFormData(INITIAL_FORM_DATA);
      setIsSubmitting(false);
      setIsOpen(false);
      setShowThankYou(true);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const renderStep1 = () => (
    <>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          What's your name?
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            name="firstName"
            placeholder="First name"
            value={formData.firstName}
            onChange={handleInputChange}
            className="block w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors duration-200 placeholder:text-gray-400 text-[15px]"
            required
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last name"
            value={formData.lastName}
            onChange={handleInputChange}
            className="block w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors duration-200 placeholder:text-gray-400 text-[15px]"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          What's your phone number?
        </label>
        <input
          type="tel"
          name="phoneNumber"
          placeholder="(555) 555-5555"
          value={formData.phoneNumber}
          onChange={handleInputChange}
          className="block w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors duration-200 placeholder:text-gray-400 text-[15px]"
          required
        />
      </div>

      <div
        onClick={() => {
          if (formData.firstName && formData.lastName && formData.phoneNumber) {
            setStep(2);
          }
        }}
        style={{
          backgroundColor: !formData.firstName || !formData.lastName || !formData.phoneNumber
            ? "gray"
            : finalConfig.buttonColor,
        }}
        className="w-full text-white px-4 py-2.5 rounded-lg font-dm-sans font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md cursor-pointer select-none"
      >
        Continue to Referral
      </div>
    </>
  );

  const renderStep2 = () => (
    <>
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={() => setStep(1)}
          className="text-gray-500 hover:text-gray-700 flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Who are you referring?
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            name="referralFirstName"
            placeholder="First name"
            value={formData.referralFirstName}
            onChange={handleInputChange}
            className="block w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors duration-200 placeholder:text-gray-400 text-[15px]"
            required
          />
          <input
            type="text"
            name="referralLastName"
            placeholder="Last name"
            value={formData.referralLastName}
            onChange={handleInputChange}
            className="block w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors duration-200 placeholder:text-gray-400 text-[15px]"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          What's their number?
        </label>
        <input
          type="tel"
          name="referralPhone"
          placeholder="(555) 555-5555"
          value={formData.referralPhone}
          onChange={handleInputChange}
          className="block w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors duration-200 placeholder:text-gray-400 text-[15px]"
          required
        />
      </div>

      {finalConfig.collectRefereeAddress && (
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            What's their address?
          </label>
          <div className="space-y-2">
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                ref={autocompleteInputRef}
                type="text"
                name="referralAddress"
                placeholder="Street address"
                value={formData.referralAddress}
                onChange={handleInputChange}
                className="block w-full pl-9 pr-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors duration-200 placeholder:text-gray-400 text-[15px]"
                required
              />
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                name="referralCity"
                placeholder="City"
                value={formData.referralCity}
                onChange={handleInputChange}
                className="block w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors duration-200 placeholder:text-gray-400 text-[15px]"
                required
              />
              <input
                type="text"
                name="referralState"
                placeholder="State"
                value={formData.referralState}
                onChange={handleInputChange}
                className="block w-1/3 px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors duration-200 placeholder:text-gray-400 text-[15px]"
                required
              />
              <input
                type="text"
                name="referralPostalCode"
                placeholder="ZIP"
                value={formData.referralPostalCode}
                onChange={handleInputChange}
                className="block w-1/3 px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors duration-200 placeholder:text-gray-400 text-[15px]"
                required
              />
            </div>
          </div>
        </div>
      )}

      <div
        onClick={() => {
          if (!isSubmitting) {
            handleSubmit();
          }
        }}
        style={{
          backgroundColor: isSubmitting
            ? "gray"
            : finalConfig.buttonColor,
        }}
        className="w-full text-white px-4 py-2.5 rounded-lg font-dm-sans font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md animate-pulse-beacon cursor-pointer select-none"
      >
        {isSubmitting ? (
          "Submitting..."
        ) : (
          <>
            <Gift className="w-4 h-4" />
            Send Referral
          </>
        )}
      </div>
    </>
  );

  if (!isOpen) {
    return (
      <>
        <div
          onClick={() => setIsOpen(true)}
          style={{ backgroundColor: finalConfig.buttonColor }}
          className="fixed bottom-4 left-4 z-50 text-white px-6 py-3 rounded-full font-dm-sans font-bold shadow-lg hover:opacity-90 transition-all flex items-center gap-2 select-none cursor-pointer"
        >
          <Gift className="w-5 h-5" />
          Refer & Earn
        </div>
        {showThankYou && (
          <ThankYouModal onClose={() => setShowThankYou(false)} />
        )}
      </>
    );
  }

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-50 md:bg-transparent md:pointer-events-none"
        onClick={() => setIsOpen(false)}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="fixed no-scrollbar max-h-screen md:absolute w-full md:w-[380px] bg-white h-full md:h-auto md:bottom-4 md:left-4 md:rounded-lg shadow-xl overflow-auto md:pointer-events-auto"
        >
          <div className="sticky top-0 bg-white p-3 border-b z-10">
            <div
              onClick={() => setIsOpen(false)}
              className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold mb-1">
              {finalConfig.headerText} 👋
            </h2>
            {finalConfig.youtubeVideoId && (
              <div className="aspect-video bg-gray-100 rounded-lg mb-3">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${finalConfig.youtubeVideoId}`}
                  title="Clicki Referrals | Affiliate Program"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            )}
            <div className="bg-green-50 p-3 rounded-lg">
              <div className="flex items-center gap-2 text-green-600 font-medium">
                <DollarSign className="w-5 h-5" />
                Earn rewards!
              </div>
              <p className="text-green-700 whitespace-pre-line">
                {finalConfig.rewardText}
              </p>
            </div>
          </div>

          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="p-3 space-y-4 pb-4 transition-[height] duration-1000 ease-in-out"
          
          >
            {step === 1 ? renderStep1() : renderStep2()}
          </form>

          <div className="p-2 text-center text-xs text-gray-500 border-t sticky bottom-0 bg-white">
            <a
              href="https://joinclicki.com/?quickform"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-700 transition-colors"
            >
              Get more referrals with Clicki Referrals ✨
            </a>
          </div>
        </div>
      </div>
      {showThankYou && <ThankYouModal onClose={() => setShowThankYou(false)} />}
    </>
  );
}
