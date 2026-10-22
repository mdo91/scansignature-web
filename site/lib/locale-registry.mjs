/** @type {readonly ['en','fr','de','ja','ko','ms','pt','ru','zh-hans','es','tr']} */
export const locales = Object.freeze(['en','fr','de','ja','ko','ms','pt','ru','zh-hans','es','tr']);
export const localeInfo = {
  en: {language:'English',market:'US',htmlLang:'en',hreflang:'en-US',ogLocale:'en_US'},
  fr: {language:'Français',market:'WORLDWIDE',htmlLang:'fr',hreflang:'fr',ogLocale:'fr_FR'},
  de: {language:'Deutsch',market:'DE',htmlLang:'de',hreflang:'de-DE',ogLocale:'de_DE'},
  ja: {language:'日本語',market:'WORLDWIDE',htmlLang:'ja',hreflang:'ja',ogLocale:'ja_JP'},
  ko: {language:'한국어',market:'WORLDWIDE',htmlLang:'ko',hreflang:'ko',ogLocale:'ko_KR'},
  ms: {language:'Bahasa Melayu',market:'WORLDWIDE',htmlLang:'ms',hreflang:'ms',ogLocale:'ms_MY'},
  pt: {language:'Português',market:'WORLDWIDE',htmlLang:'pt',hreflang:'pt',ogLocale:'pt_BR'},
  ru: {language:'Русский',market:'WORLDWIDE',htmlLang:'ru',hreflang:'ru',ogLocale:'ru_RU'},
  'zh-hans': {language:'简体中文',market:'WORLDWIDE',htmlLang:'zh-hans',hreflang:'zh-Hans',ogLocale:'zh_CN'},
  es: {language:'Español',market:'ES',htmlLang:'es',hreflang:'es-ES',ogLocale:'es_ES'},
  tr: {language:'Türkçe',market:'TR',htmlLang:'tr',hreflang:'tr-TR',ogLocale:'tr_TR'},
};
export const localePath = (locale, route='/') => locale==='en' ? route : `/${locale}${route}`;
