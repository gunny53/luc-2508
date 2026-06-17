// import { getRequestConfig } from "next-intl/server";
// import { cookies } from "next/headers";

// export default getRequestConfig(async () => {
//   // Get language from cookie or default to 'vi'
//   const cookieLocale = (await cookies()).get("NEXT_LOCALE")?.value || "vi";
//   const locale = cookieLocale;
//   console.log("locale:", locale);

//   return {
//     locale,
//     messages: (await import(`./messages/${locale}.json`)).default,
//   };
// });


import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";

export default getRequestConfig(async () => {
  // Get language from cookie or default to 'vi'
  const cookieLocale = (await cookies()).get("NEXT_LOCALE")?.value || "vi";
  const locale = cookieLocale;
  console.log("locale:", locale);

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
    // English content normalized from the original source text.
    skipInspection: true,

    // English content normalized from the original source text.
    defaultLocale: "vi",

    // English content normalized from the original source text.
    onError: (error) => {
      // English content normalized from the original source text.
      if (process.env.NODE_ENV === 'development') {
        console.warn('i18n warning:', error.message);
      }
    }
  };
});