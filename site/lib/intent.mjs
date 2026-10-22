const contentLocale=name=>name?.startsWith('site/content/blog/')?(name.split('/').length===4?'en':name.split('/')[3]):null;
export const intentPolicyVersion=1;
export const keywordKey=value=>String(value||'').normalize('NFKC').normalize('NFD').replace(/(\p{Script=Latin})\p{M}+/gu,'$1').normalize('NFC').toLowerCase().replace(/[^\p{L}\p{N}]+/gu,' ').trim();
const signature=/signature|\bsign(?:ed|ing|er|e|ee|es|ees)?\b|assin[ae]|unterschreib|unterzeich|unterschrift|signatur|firma|assinatura|tandatangan|imza|подпис|роспись|署名|サイン|서명|签名|簽名|签署/;
const document=/pdf|pages?|seiten|paginas?|halaman|sayfa|страниц|ページ|페이지|页面|document|dokument|dokumen|belge|evrak|kagit|paper|papier|kertas|papel|документ|бумаг|書類|文書|문서|서류|文件|纸张/;
const scan=/scan|num[eé]ris|digitaliz|escan|imbas|tara|скан|スキャン|撮影|스캔|扫描|掃描/;
const background=/background|fond|hintergrund|fundo|latar|arka plan|фон|背景|배경|clean|balanced|bold|faint|stroke|trait|trazo|traco|linien|garisan|cizgi|линии|細い|线|획|가는/;
const share=/share|send|attach|save|partag|envoi|piece jointe|teilen|anhang|speicher|compart|adjunto|salvar|anexo|kongsi|lampiran|hantar|paylas|gonder|kaydet|ek |отправ|вложен|сохран|共有|送信|添付|保存|공유|첨부|저장|分享|附件/;
const device=/iphone|ipad|ios|ipados|apple|アイフォン|アイパッド|아이폰|아이패드/;
const app=/\bapp\b|application|appli|aplicativo|aplikasi|uygulama|приложен|アプリ|앱|应用/;
const unsupported=[
 ['media-task',/youtube|instagram|mp3|mp4|video|transcri|動画|视频|유튜브/],
 ['ocr',/\bocr\b|recognize text|text recognition|reconnaissance de texte|texterkennung|reconocer texto|reconhecimento de texto|pengenalan teks|metin tanima|распознавани|文字認識|文字识别|텍스트 인식/],
 ['pdf-merge',/merge.*pdf|pdf.*merge|fusionner.*pdf|pdf.*zusammenfugen|unir.*pdf|mesclar.*pdf|gabung.*pdf|pdf.*birlestir|объедин.*pdf|pdf.*объедин|pdf.*結合|pdf.*合并|pdf.*병합/],
 ['image-export',/\bpng\b|export.*jpe?g|standalone.*image|скачать.*изображен|画像.*書き出し|图片.*导出/],
 ['certificate-or-identity',/certificate|certificat|zertifikat|certificad|sijil|sertifika|сертификат|電子証明|数字证书|인증서|identity verif|identite|identitat|identidad|identidade|pengesahan identiti|kimlik dogrula|идентификац|本人確認|身份验证|본인 인증|eidas|esign|legally binding|юридическ|法的|法律效力/],
 ['signature-request',/request signature|collect signatures|demande de signature|unterschrift anfordern|solicitar.*firma|solicitar.*assinatura|minta tandatangan|imza talebi|запрос.*подпис|署名依頼|请求签名|서명 요청/],
 ['unsupported-editor',/edit pdf text|password protect|encrypt pdf|modifier.*texte|pdf.*verschlussel|editar.*texto|sunting.*teks|pdf.*sifrele|редактировать.*текст|暗号化|加密|암호화/],
 ['unsupported-platform',/android|windows|macbook|\bmacos\b|\bmac\b/]
];
export function classifyKeyword(text,locale){
 const key=keywordKey(text);
 for(const [reason,pattern]of unsupported)if(pattern.test(key))return {eligible:false,reason};
 const s=signature.test(key),d=document.test(key),c=scan.test(key),b=background.test(key),r=share.test(key);
 const reused=/reus|reutil|wieder|guna semula|yeniden|повтор|再利用|재사용|重复使用/.test(key),ink=/\bink\b|encre|tinta|dakwat|murekkep|чернил|インク|잉크|墨水/.test(key);
 const feature=s&&b?'background-removal':s&&(c||reused||ink)?'signature-capture':r&&(s||d)?'document-sharing':s&&d?'pdf-signing':c&&d?'document-scan':null;
 if(!feature)return {eligible:false,reason:'unrelated-or-ambiguous-task'};
 const reasons=[`supported-${feature}`,...(device.test(key)?['apple-device']:[]),...(app.test(key)?['app-seeking']:[]),...(/digital signature|signature numerique|digitale signatur|firma digital|assinatura digital/.test(key)?['clarify-image-versus-certificate']:[])];
 return {eligible:true,locale,feature,reasons,fitScore:100+(device.test(key)?20:0)+(app.test(key)?10:0)+(s?10:0)};
}
export function rankKeywords(keywords=[],locale,{limit=25,opportunities=[],coverage=[]}={}){
 const excluded={},eligible=[],covered=new Set(coverage.filter(row=>contentLocale(row.path)===locale).map(row=>keywordKey(row.primaryQuery)));
 for(const item of keywords){
  const intent=classifyKeyword(item.text,locale);if(!intent.eligible){excluded[intent.reason]=(excluded[intent.reason]||0)+1;continue;}
  const existingQuery=[item.text,...(item.closeVariants||[])].some(value=>covered.has(keywordKey(value)));
  const volume=item.averageMonthlySearches,demand=typeof volume==='number'&&Number.isFinite(volume)&&volume>=0?Math.min(9,Math.log10(volume+1)*2):0;
  eligible.push({...item,intent:{...intent,existingQuery,discoveryTier:existingQuery?0:1,priority:intent.fitScore+demand+(opportunities.some(row=>keywordKey(row.query)===keywordKey(item.text))?3:0)}});
 }
 const parent=eligible.map((_,i)=>i),seen=new Map(),root=i=>parent[i]===i?i:(parent[i]=root(parent[i]));
 eligible.forEach((item,i)=>{for(const key of [item.text,...(item.closeVariants||[])].map(keywordKey)){if(seen.has(key))parent[root(i)]=root(seen.get(key));else seen.set(key,i);}});
 const coveredGroups=new Set(eligible.flatMap((item,i)=>item.intent.existingQuery?[root(i)]:[]));
 const groups=new Map();eligible.forEach((item,i)=>{const key=root(i);if(coveredGroups.has(key)){item.intent.existingQuery=true;item.intent.discoveryTier=0;}const old=groups.get(key);if(!old||item.intent.priority>old.intent.priority)groups.set(key,item);});
 const ranked=[...groups.values()].sort((a,b)=>b.intent.discoveryTier-a.intent.discoveryTier||b.intent.priority-a.intent.priority||keywordKey(a.text).localeCompare(keywordKey(b.text)));
 return {policyVersion:intentPolicyVersion,considered:keywords.length,eligible:ranked.length,excluded,keywords:ranked.slice(0,limit)};
}
