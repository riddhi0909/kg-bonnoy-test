import { Geist, Geist_Mono, Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { getPublicEnv } from "@/config/env";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-bonnot-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const { siteUrl } = getPublicEnv();

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Headless Shop", template: "%s · Headless Shop" },
  description: "WooCommerce + WPGraphQL + Next.js modular storefront",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} ${plusJakartaSans.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body
        className="min-h-full flex flex-col font-sans"
        suppressHydrationWarning
      >
        <Script
          id="strip-extension-hydration-attrs"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{var ATTR='bis_skin_checked';var strip=function(root){if(!root)return;try{if(root.nodeType===1&&root.hasAttribute&&root.hasAttribute(ATTR)){root.removeAttribute(ATTR);}var nodes=root.querySelectorAll?root.querySelectorAll('['+ATTR+']'):[];for(var i=0;i<nodes.length;i++){nodes[i].removeAttribute(ATTR);}}catch(_){}};strip(document.documentElement);var obs=new MutationObserver(function(muts){for(var i=0;i<muts.length;i++){var m=muts[i];if(m.type==='attributes'&&m.attributeName===ATTR&&m.target&&m.target.removeAttribute){m.target.removeAttribute(ATTR);}if(m.addedNodes&&m.addedNodes.length){for(var j=0;j<m.addedNodes.length;j++){strip(m.addedNodes[j]);}}}});obs.observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:[ATTR]});window.addEventListener('load',function(){setTimeout(function(){obs.disconnect();},2000);},{once:true});}catch(_){}})();",
          }}
        />
        {children}
      </body>
    </html>
  );
}
