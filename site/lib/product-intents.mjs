// Lexical release-sensitive tasks. Public eligibility follows the reviewed product facts;
// the private publisher independently rechecks fresh Apple release evidence.
const normalize=value=>String(value||'').normalize('NFKC').normalize('NFD').replace(/(\p{Script=Latin})\p{M}+/gu,'$1').normalize('NFC').toLowerCase().replace(/[^\p{L}\p{N}]+/gu,' ').trim();
const document=/pdf|acroform|document|dokument|dokumen|belge|evrak|papier|paper|papel|документ|文書|書類|문서|서류|文件|文档/;
const form=/\bforms?\b|\bform(?:u|unu|lari)\b|formulair|formular|borang|(?:^| )форм(?:а|у|ы|е|ой)?(?: |$)|フォーム|양식|表单|表單/;
const fill=/fill|complet|rempl|ausfull|preench|заполн|rellen|doldur|\bisi\b|入力|記入|작성|채우|填写|填寫/;
const add=/\badd\b|\binsert|ajout|inser|einfug|hinzufug|adicion|добав|встав|anad|agreg|ekle|tambah|追加|追記|추가|添加|新增|加入/;
const text=/\btext\b|texte|texto|teks|metin|текст|文字|文本|텍스트/;
const mark=/checkmarks?|check marks?|tick marks?|coches?|hakchen|チェックマーク|체크 표시|tanda semak|marcas? de selecao|галочк|勾选|勾選|marcas? de verificacion|onay isareti/;
const handwriting=/signature|\bsign(?:ed|ing)?\b|unterschrift|assinatura|tandatangan|imza|подпис|署名|サイン|서명|签名|簽名|firma|paraph|rubric|paraf|イニシャル|이니셜|姓名首字母|инициал|\binitials\b|initialen|iniciales/;
const initials=/paraph|rubric|paraf|イニシャル|이니셜|姓名首字母|инициал|\binitials\b|initialen|iniciales/;
const multiple=/\bmultiple\b|\bseveral\b|more than one|each page|every page|all pages|duplicat|plusieurs|chaque page|dupliqu|mehrere|jeder seite|alle seiten|複数|各ページ|全ページ|複製|여러|모든 페이지|복제|berbilang|setiap halaman|gandakan|varias|varios|cada pagina|todas as paginas|нескольк|каждой страниц|всех страниц|多个|多個|每页|每頁|birden fazla|her sayfa|cogalt/;
const template=/\btemplates?\b|modele|vorlage|テンプレート|템플릿|templat|modelo|шаблон|模板|模版|plantilla|sablon/;

// Recognize release-sensitive intents before the legacy signing/reuse fallback.
// Results are lexical requirements, never assertions of availability or demand.
export function requiredFeatureIds(value){
 const key=normalize(value);if(!document.test(key))return [];
 const required=[];
 if(/acroforms?|fillable pdf/.test(key)||form.test(key)&&fill.test(key)||/\b(?:fill(?:ing)?|remplir|ausfullen|preencher|rellenar|doldurma|doldurmak)\b/.test(key)&&/\bpdf\b/.test(key)||/pdf.{0,10}(?:填写|記入|입력|작성)|(?:填写|記入|작성).{0,10}pdf/.test(key))required.push('native-form-filling');
 if((add.test(key)||/\bmanual\b|positioned|overlay/.test(key))&&(text.test(key)||mark.test(key)))required.push('manual-text-checkmarks');
 if(initials.test(key)||handwriting.test(key)&&multiple.test(key))required.push('multiple-placements');
 const deviceModel=/\b(?:modelo|modele) (?:d |de |du |do |da |del )?(?:iphone|ipad|ios|ipados|apple)\b/.test(key);
 if(template.test(key)&&(!deviceModel||/\btemplates?\b|vorlage|テンプレート|템플릿|templat|шаблон|模板|模版|plantilla|sablon/.test(key)))required.push('reusable-templates');
 return required;
}

