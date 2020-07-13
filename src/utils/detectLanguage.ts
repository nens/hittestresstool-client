const supportedLocales = ["en", "nl"];
const defaultLocale = "en";


export const getLocaleStringFromBrowserSetting = () => {
  const preferredLocaleList = getBrowserLocaleStringList();
  const maybeFoundPreferredLocale = preferredLocaleList.find(getSupportedLocaleFromPreferredLocale)
  if (maybeFoundPreferredLocale) {
    return getSupportedLocaleFromPreferredLocale(maybeFoundPreferredLocale) + '';
  } else {
    return defaultLocale;
  }
}

const getBrowserLocaleStringList = (): readonly string[] => {
  const languageString = navigator.languages;

  if ( languageString !== null && languageString  && languageString.length) {
    return languageString;
  } else  {
    return [
      navigator.language ||
      //  @ts-ignore
      navigator.userLanguage ||
      defaultLocale
    ];
  }
}

// returns supported locale if found and otherwise null
const getSupportedLocaleFromPreferredLocale = (preferredLocale: string) => {
  return (
    // exactmatch
    supportedLocales.find(supportedLocale => supportedLocale === preferredLocale)
    ||
    // partial match: string before "-". For example: "en-GB" -> "en".
    supportedLocales.find(supportedLocale =>
      supportedLocale === (preferredLocale.split('-')[0].toLowerCase())
    )
    ||
    null
  );
}
