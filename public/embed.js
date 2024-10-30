// Clicki Referrals Widget Loader
(function () {
  // Create a unique namespace for the widget
  window.ClickiReferral = window.ClickiReferral || {};

  // Store the configuration
  window.ClickiReferral.config = {
    buttonColor: window.ClickiReferralConfig?.buttonColor || "#4F46E5",
    youtubeVideoId:
      window.ClickiReferralConfig?.youtubeVideoId?.trim() || "your-video-id",
    headerText:
      window.ClickiReferralConfig?.headerText ||
      "Refer a business to Clicki Referrals!",
    rewardText:
      window.ClickiReferralConfig?.rewardText || "Earn $25 per referral",
    webhookUrl1:
      window.ClickiReferralConfig?.webhookUrl1 || "YOUR_FIRST_WEBHOOK_URL",
    webhookUrl2:
      window.ClickiReferralConfig?.webhookUrl2 || "YOUR_SECOND_WEBHOOK_URL",
  };

  // Load the main widget script
  const script = document.createElement("script");
  script.src = "https://quickform.clicki.io/widget.js";
  script.async = true;
  document.body.appendChild(script);
})();
