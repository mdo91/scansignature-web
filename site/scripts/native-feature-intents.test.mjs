import test from 'node:test';
import assert from 'node:assert/strict';
import {classifyKeyword,rankKeywords} from '../lib/intent.mjs';
import {requiredFeatureIds,unsupportedFormFieldReason} from '../lib/product-intents.mjs';

// Provider wording and estimates from the 2026-10-26 matching-language caches.
const observed=[
 {locale:'ja',text:'pdf テキスト 追加',averageMonthlySearches:480,feature:'manual-text-checkmarks'},
 {locale:'de',text:'pdf textfeld einfügen',averageMonthlySearches:320,feature:'manual-text-checkmarks'},
 {locale:'es',text:'llenar formulario en pdf',averageMonthlySearches:10,feature:'native-form-filling'},
];

test('native provider terms identify the released task without changing demand or canonical wording',()=>{
 for(const {locale,text,averageMonthlySearches,feature} of observed){
  assert.deepEqual(requiredFeatureIds(text),[feature],text);
  const result=classifyKeyword(text,locale);
  assert.equal(result.eligible,true,text);assert.equal(result.feature,feature,text);
  const ranked=rankKeywords([{text,averageMonthlySearches}],locale);
  assert.equal(ranked.keywords[0].text,text);assert.equal(ranked.keywords[0].averageMonthlySearches,averageMonthlySearches);
 }
 assert.equal(classifyKeyword('PDFにテキストを追加する','ja').feature,'manual-text-checkmarks');
 assert.equal(classifyKeyword('Textfeld im PDF manuell einfügen','de').feature,'manual-text-checkmarks');
 assert.equal(classifyKeyword('vorhandenes PDF Formular ausfüllen','de').feature,'native-form-filling');
});

test('explicit interactive-field creation, automatic field detection and OCR remain unsupported',()=>{
 for(const [locale,text,reason] of [
  ['de','interaktives Textfeld in PDF einfügen','form-field-creation'],
  ['de','ausfüllbares Textfeld im PDF erstellen','form-field-creation'],
  ['de','neue PDF Formularfelder erstellen','form-field-creation'],
  ['en','add a new interactive text field to PDF','form-field-creation'],
  ['ja','PDFに入力可能なテキストフィールドを追加','form-field-creation'],
  ['es','añadir un campo de texto interactivo al PDF','form-field-creation'],
  ['de','PDF Textfelder automatisch erkennen und einfügen','automatic-field-detection'],
  ['ja','PDFのテキストフィールドを自動検出して追加','automatic-field-detection'],
 ]){
  assert.equal(unsupportedFormFieldReason(text),reason,text);
  const result=classifyKeyword(text,locale);assert.equal(result.eligible,false,text);assert.equal(result.reason,reason,text);
 }
 for(const text of ['OCR PDF テキスト 追加','Texterkennung PDF Textfeld einfügen','llenar formulario PDF XFA'])assert.equal(classifyKeyword(text,'en').eligible,false,text);
});

test('PDF input diagnostics and original-copy recovery stay distinct from editing, unlocking or creating controls',()=>{
 assert.equal(classifyKeyword('select an existing PDF checkbox','en').feature,'native-form-filling');
 assert.equal(classifyKeyword('add a checkmark to an existing printed PDF checkbox','en').feature,'manual-text-checkmarks');
 for(const text of ['add a new interactive PDF checkbox','add a new interactive checkbox to a printed PDF with a checkmark'])assert.equal(classifyKeyword(text,'en').eligible,false,text);
 for(const text of ['why a PDF form will not let me type','pourquoi mon formulaire PDF refuse la saisie de texte','почему в форму PDF нельзя ввести текст'])assert.equal(classifyKeyword(text,'en').feature,'native-form-filling',text);
 for(const text of ['restart the original after an incorrect flattened PDF export','reprendre l’original après une erreur dans un PDF aplati','ошибка в плоском PDF: заполнить исходный файл заново'])assert.equal(classifyKeyword(text,'en').eligible,true,text);
 for(const text of [
  'correct existing PDF text','replace existing PDF page text','corriger le texte existant du PDF',
  'remove read only from a PDF form and fill it','PDF Schreibschutz aufheben und Formular ausfüllen',
  'déverrouiller un formulaire PDF en lecture seule','desbloquear formulario PDF de solo lectura',
  'PDFの読み取り専用を解除してフォームに入力','읽기 전용 PDF 잠금 해제 후 양식 작성',
  '取消 PDF 只读限制并填写表单','create PDF radio buttons then select one',
  'PDF Optionsfeld erstellen und auswählen','PDFフォームのラジオボタンを作成して選択',
  'PDF 양식 라디오 버튼을 추가하고 선택','criar caixa de seleção em formulário PDF',
  'automatic checkbox recognition in a PDF form',
 ])assert.equal(classifyKeyword(text,'en').eligible,false,text);
 assert.equal(classifyKeyword('restart an incorrect PDF export','en').eligible,false);
});
