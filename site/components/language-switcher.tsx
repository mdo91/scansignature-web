import {localeInfo,localePath,locales,type Locale} from '@/lib/locales';
import {sitePath} from '@/lib/site';
export default function LanguageSwitcher({locale,route='/',alternates}:{locale:Locale;route?:string;alternates?:Record<string,string>}) {
  return <details className="language-switcher"><summary aria-label={localeInfo[locale].language}>{localeInfo[locale].language} <span aria-hidden="true">⌄</span></summary><nav aria-label={localeInfo[locale].language}><ul>{locales.map(code=>{
    const target=alternates ? alternates[localeInfo[code].hreflang] || localePath(code,'/blog/') : localePath(code,route);
    return <li key={code}><a href={sitePath(target)} lang={localeInfo[code].htmlLang} hrefLang={localeInfo[code].hreflang} aria-current={code===locale?'page':undefined}>{localeInfo[code].language}</a></li>;
  })}</ul></nav></details>;
}
