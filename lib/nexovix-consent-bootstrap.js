/*! Nexovix Connect consent bootstrap
 * Load this BEFORE GTM / gtag config.
 * Cookie Accept-all must call: window.__nexovixGrantAnalytics(true)
 */
(function () {
  if (typeof window === "undefined") return;
  var w = window;
  w.dataLayer = w.dataLayer || [];
  function gtag(){ w.dataLayer.push(arguments); }
  w.gtag = w.gtag || gtag;
  if (!w.__nexovixConsentDefaulted) {
    w.__nexovixConsentDefaulted = true;
    gtag("consent", "default", {
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      analytics_storage: "denied",
      functionality_storage: "denied",
      personalization_storage: "denied",
      security_storage: "granted",
      wait_for_update: 2000
    });
  }
  w.__nexovixGrantAnalytics = function (granted) {
    var state = granted ? "granted" : "denied";
    gtag("consent", "update", {
      analytics_storage: state,
      ad_storage: state,
      ad_user_data: state,
      ad_personalization: state
    });
    w.dataLayer.push({
      event: "nexovix_cookie_consent",
      analytics_storage: state
    });
  };
})();
