import Script from "next/script";
import { getGaMeasurementId, getGtmId } from "@/lib/analytics-env";

export function AnalyticsScripts() {
  const gtmId = getGtmId();
  const gaMeasurementId = getGaMeasurementId();

  if (!gtmId && !gaMeasurementId) return null;

  const useGtm = Boolean(gtmId);
  const useGaDirect = !useGtm && Boolean(gaMeasurementId);

  return (
    <>
      {useGtm && gtmId && (
        <>
          <Script id="gtm-base" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');`}
          </Script>
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
              title="Google Tag Manager"
            />
          </noscript>
        </>
      )}

      {useGaDirect && gaMeasurementId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-base" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js', new Date());gtag('config', '${gaMeasurementId}', { send_page_view: false });`}
          </Script>
        </>
      )}
    </>
  );
}
