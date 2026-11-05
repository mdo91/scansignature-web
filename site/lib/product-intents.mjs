// Lexical release-sensitive tasks. Public eligibility follows the reviewed product facts;
// the private publisher independently rechecks fresh Apple release evidence.
const normalize=value=>String(value||'').normalize('NFKC').normalize('NFD').replace(/(\p{Script=Latin})\p{M}+/gu,'$1').normalize('NFC').toLowerCase().replace(/[^\p{L}\p{N}]+/gu,' ').trim();
const document=/pdf|acroform|document|dokument|dokumen|belge|evrak|papier|paper|papel|документ|文書|書類|문서|서류|文件|文档/;
const form=/\bforms?\b|\bform(?:u|unu|una|unda|undaki|lari)\b|formulair|formular|borang|(?:^| )форм(?:а|у|ы|е|ой)?(?: |$)|フォーム|양식|表单|表單/;
const fill=/fill|complet|rempl|ausfull|preench|заполн|rellen|llenar|doldur|\bisi\b|入力|記入|작성|채우|填写|填寫/;
const add=/\badd\b|\binsert|ajout|inser|einfug|hinzufug|adicion|добав|встав|anad|agreg|ekle|tambah|追加|追記|추가|添加|新增|加入/;
const text=/\btext\b|textfeld|texte|texto|teks|metin|текст|文字|テキスト|文本|텍스트/;
const mark=/checkmarks?|check marks?|tick marks?|coches?|hakchen|チェックマーク|체크 표시|tanda semak|marcas? de selecao|галочк|勾选|勾選|marcas? de verificacion|onay isareti/;
const handwriting=/signature|\bsign(?:ed|ing)?\b|unterschrift|assinatura|tandatangan|imza|подпис|署名|サイン|서명|签名|簽名|firma|paraph|rubric|paraf|イニシャル|이니셜|姓名首字母|инициал|\binitials\b|initialen|iniciales/;
const initials=/paraph|rubric|paraf|イニシャル|이니셜|姓名首字母|инициал|\binitials\b|initialen|iniciales/;
const multiple=/\bmultiple\b|\bseveral\b|more than one|each page|every page|all pages|duplicat|plusieurs|chaque page|dupliqu|mehrere|jeder seite|alle seiten|複数|各ページ|全ページ|複製|여러|모든 페이지|복제|berbilang|setiap halaman|gandakan|varias|varios|cada pagina|todas as paginas|нескольк|каждой страниц|всех страниц|多个|多個|每页|每頁|birden fazla|her sayfa|cogalt/;
const template=/\btemplates?\b|modele|vorlage|テンプレート|템플릿|templat|modelo|шаблон|模板|模版|plantilla|sablon/;
const formControl=/check\s?box(?:es)?|radio buttons?|dropdown|drop down|choice (?:list|field)|cases? a cocher|bouton radio|liste deroulante|kontrollkastchen|optionsfeld|auswahlliste|チェックボックス|ラジオボタン|プルダウン|체크박스|라디오 버튼|드롭다운|kotak pilihan|butang radio|senarai pilihan|caixas? de selecao|botao de opcao|lista suspensa|флаж|переключател|выпадающ|复选框|单选按钮|下拉列表|casillas? de verificacion|boton de opcion|lista desplegable|onay kutu|radyo dugme|acilir liste/;
const selectControl=/\bselect|\bchoose|\bcheck\b|\bmark\b|choisir|cocher|selectionn|auswahl|wahlen|選ぶ|選択|チェックを入|체크하기|선택|tandakan|pilih|selecion|escolher|отмет|выбр|勾选|选择|seleccion|elegir|isaret|secme/;
const answerField=/text fields?|textfeld|\bchamps?\b|campo de texto|metin alani|ruang borang|поле формы|入力欄|枠内|입력란|输入框/;
const longAnswer=/long (?:answer|response)|reponse longue|longue reponse|lange antwort|respuesta larga|resposta longa|uzun yanit|длинн[\p{L}]* ответ|長い回答|긴 답변|jawapan panjang|长答案/u;
function printedMarkOverlay(key){
 const affirmative=key.replace(/non ?interactive|non interactif|nicht interaktiv|no interactivo|nao interativo/g,'');
 return add.test(key)&&mark.test(key)&&/printed|flat|scanned|imprime|numerise|gedruck|gescannt|escanead|digitalizad|diimbas|tercetak|напечат|плоск|印刷|フラット|평면|扁平|扫描|taranmis/.test(key)
  &&!/interactive|fillable|interaktiv|ausfullbar|interactif|interactivo|rellenable|入力可能|インタラクティブ/.test(affirmative);
}

// These are operations on existing PDF controls, not new field creation. A
// typing problem is diagnostic: it never authorizes unlocking read-only fields.
function nativeFormTask(value){
 const key=value.replace(/ı/g,'i');
 if(printedMarkOverlay(key))return false;
 if(formControl.test(key)&&(selectControl.test(key)||fill.test(key)))return true;
 if(longAnswer.test(key)&&(form.test(key)||answerField.test(key)))return true;
 const typingProblem=/(?:will not|won t|cannot|can t).{0,20}(?:type|enter|write)|ne me laisse pas saisir|refuse la saisie|nicht schreiben|no me deja escribir|nao consigo digitar|tidak boleh ditaip|не да[её]т вводить|нельзя ввести|无法输入|不能输入|yazi yazamiyorum/;
 return typingProblem.test(key)&&(form.test(key)||answerField.test(key)||/пол[ья]/.test(key));
}
function restartFromOriginal(value){
 const key=value.replace(/ı/g,'i');
 return /original|\basal\b|ozgun|исходн|元pdf|元のpdf|原本|原始\s*pdf/.test(key)
  &&/start again|restart|repartir|reprendre|neu beginnen|volver|recomecar|mula semula|заново|やり直|다시 작성|重新填写|yeniden baslama/.test(key)
  &&/incorrect|error|erro|fehler|erreur|tersalah|ошиб|ミス|오류|填错|hata/.test(key)
  &&/flatten|aplanad|aplati|achatad|diratakan|duzlestir|плоск|フラット化|平面化|扁平化|export|eksport|экспорт|書き出|내보낸|导出|cikti/.test(key);
}

// A text box can mean a manually positioned answer or a new interactive field.
// Only explicit field creation/detection is unsupported; plain text placement
// still requires the reviewed manual-text-checkmarks release capability.
export function unsupportedFormFieldReason(value){
 const key=normalize(value).replace(/ı/g,'i');if(!document.test(key))return null;
 const locked=/read only|readonly|schreibgeschutzt|schreibschutz|lecture seule|sol[ao] lectura|so leitura|somente leitura|baca sahaja|salt okunur|только.{0,10}чтени|読み取り専用|읽기 전용|只读/;
 const unlock=/unlock|unprotect|\bremove\b|\bdisable\b|\bbypass\b|entsperr|aufheben|deverrouill|desbloqu|remover|supprimer|buang|buka kunci|kilid.{0,12}kaldir|разблок|защит.{0,15}снят|解除|잠금 해제|解锁|取消/;
 if(locked.test(key)&&unlock.test(key))return 'unsupported-editor';
 const printed=/existing (?:pdf |page )*text|texte existant|(?:bestehend|vorhanden)[\p{L}]*.{0,20}text|texto existente|teks sedia ada|mevcut metin|var olan metin|существующ[\p{L}]*.{0,20}текст|既存.{0,20}(?:文字|テキスト)|기존.{0,20}텍스트|原有文字/u;
 const edit=/edit|modify|correct|replace|delete|corrig|modifier|korrig|andern|bearbeit|correg|editar|sunting|betul|degistir|duzelt|исправ|редакт|замен|修正|変更|수정|변경|修改|更改/;
 if(printed.test(key)&&edit.test(key))return 'unsupported-editor';
 const field=/form fields?|text fields?|formularfeld|textfeld|champs?|campos?|フォームフィールド|テキストフィールド|入力欄/;
 const automatic=/automatic|automatisch|automatique|automatica|automatico|自動/;
 const detection=/detect|recogn|erkenn|reconn|検出|検知|認識/;
 if((field.test(key)||formControl.test(key))&&automatic.test(key)&&detection.test(key))return 'automatic-field-detection';
 const interactive=/interactive|fillable|interaktiv|ausfullbar|interactif|interactivo|rellenable|入力可能|インタラクティブ/;
 const create=/\b(?:create|make|insert|add|build)\b|creer|ajout|erstell|einfug|anleg|hinzufug|crear|anad|agreg|criar|buat|cipta|tambah|созда|добав|olustur|ekle|作成|追加|추가|생성|만들|创建|制作|新增/;
 if(field.test(key)&&interactive.test(key)&&create.test(key))return 'form-field-creation';
 if(formControl.test(key)&&create.test(key)&&!printedMarkOverlay(key))return 'form-field-creation';
 if(/(?:create|make|build).{0,35}(?:form fields?|fillable pdf)|(?:creer|crear).{0,35}(?:champs? de formulaire|campos? de formulario)|formularfelder.{0,20}erstellen|フォームフィールド.{0,10}作成/.test(key))return 'form-field-creation';
 return null;
}

// Recognize release-sensitive intents before the legacy signing/reuse fallback.
// Results are lexical requirements, never assertions of availability or demand.
export function requiredFeatureIds(value){
 const key=normalize(value);if(!document.test(key))return [];
 const required=[];
 if(/acroforms?|fillable pdf/.test(key)||form.test(key)&&fill.test(key)||nativeFormTask(key)||/\b(?:fill(?:ing)?|remplir|ausfullen|preencher|rellenar|llenar|doldurma|doldurmak)\b/.test(key)&&/\bpdf\b/.test(key)||/pdf.{0,10}(?:填写|記入|입력|작성)|(?:填写|記入|작성).{0,10}pdf/.test(key))required.push('native-form-filling');
 if((add.test(key)||/\bmanual\b|positioned|overlay/.test(key))&&(text.test(key)||mark.test(key)))required.push('manual-text-checkmarks');
 const semanticKey=key.replace(/ı/g,'i');
 const date=/\bdates?\b|\bdatum\b|fecha|\bdata\b|tarikh|tarih|дат[ауы]|日付|날짜|日期/;
 const two=/\btwo\b|\bdeux\b|\bzwei\b|\bdos\b|\bduas\b|\bdua\b|две|два|两个|2つ|二つ|두 개|\biki\b/;
 const place=/\bplace|placer|platzier|colocar|letak|добав|入れる|넣기|放入|yerlestir/;
 if(initials.test(key)||handwriting.test(key)&&(multiple.test(key)||date.test(semanticKey)&&add.test(semanticKey)||two.test(semanticKey)&&place.test(semanticKey)))required.push('multiple-placements');
 const deviceModel=/\b(?:modelo|modele) (?:d |de |du |do |da |del )?(?:iphone|ipad|ios|ipados|apple)\b/.test(key);
 if(template.test(key)&&(!deviceModel||/\btemplates?\b|vorlage|テンプレート|템플릿|templat|шаблон|模板|模版|plantilla|sablon/.test(key)))required.push('reusable-templates');
 // Reopen an unchanged source after a failed completed export; this is copy
 // selection/sharing, never editing or unflattening the exported page content.
 if(!required.length&&restartFromOriginal(key))required.push('document-sharing');
 return required;
}
