---
translationKey: "remove-background-scanned-signature"
title: "スキャンした署名の紙背景をiPhoneで除く方法"
description: "筆跡を残して紙の背景を取り除き、白い四角で文字を隠さずにPDFへ署名を配置する方法を説明します。"
publishedAt: "2026-10-22"
updatedAt: "2026-10-22"
topic: "署名を調整する"
primaryQuery: "iPhone スキャンした署名 紙の背景 削除"
image: "/mockup/select-best-version-of-scanned-signature.png"
imageAlt: "SignDocsのCleanとBalancedの署名抽出結果。"
related: ["scan-handwritten-signature-iphone", "sign-pdf-iphone-without-printing"]
sources: [{"title": "Signature Scan: Sign PDFs — App Storeの説明", "url": "https://apps.apple.com/us/app/signature-scan-sign-pdfs/id6805875185"}]
status: "published"
---

紙に書いた署名を写真にすると、別の文書に重ねたときに白い四角が残ることがあります。SignDocsでは署名用カメラで筆跡を取り込み、周囲を切り抜いてClean、Balanced、Boldの結果を比較します。実際の線を読みやすく保ちながら紙を取り除く結果を選びましょう。

処理した署名はアプリ内でPDFへの署名に使用します。このガイドは、独立した透過PNGの書き出し機能があるとは想定していません。Signature Scan: Sign PDFs（SignDocs）にはiOS 26またはiPadOS 26以降が必要です。

## 鮮明な撮影から始める

背景除去は元の写真を使う処理です。無地の紙、対応する黒・赤・濃い青のインク、均一な照明を使います。ピントを合わせ、文字に影を落とさないようにしてください。

ページ全体を撮った場合は、署名が中心になるよう周りを切り抜きます。細い書き終わりや長い下線を切り落とさないでください。[署名の取り込みガイド](/blog/scan-handwritten-signature-iphone/)で準備と撮影を説明しています。

## 抽出結果を比較する

1. SignDocsの専用カメラで署名を撮影します。
2. 署名全体を残しつつ、不要な紙を除くように切り抜きます。
3. 利用できる抽出結果を開きます。
4. 名前だけで決めず、**Clean**、**Balanced**、**Bold**を比較します。
5. 文字の周りの紙と、筆跡の最も細い部分を確認します。
6. 忠実で読みやすい結果を保存します。適切な結果がなければ撮り直します。

![保存前にインクと背景を比較できるCleanとBalancedのプレビュー。](/mockup/select-best-version-of-scanned-signature.png)

目標は、配置先のPDFで元の署名が読めることです。紙を多く消せても、筆跡まで消えるなら良い結果とはいえません。

## 影や欠けた線を直す

紙の影が残る場合は、より均一な照明で撮り直します。電話の真後ろから光を当てると紙に電話の影が出るため、位置を変えてください。

細い線が消える場合は別の結果を見ます。元の文字が薄い、または写真がぼやけているなら、まず撮影を改善します。同じ悪い画像を何度も加工するより、新しい紙にはっきり書き直す方が役立つ場合があります。

元のインクと色が違って見えるときは、偏りの少ない光の下で紙と写真を比較してください。SignDocsは対応するインクの色を保つ設計ですが、保存前に実際の結果を確認しましょう。

## PDF上で署名を確認する

文書を開いて保存した署名を置き、その境界を見ます。白い塊で文章を隠すのではなく、自然にページへ重なるか確認してください。適切な幅に調整し、筆跡の読みやすさを見ます。

配置と保存は[iPhoneでPDFに署名するガイド](/blog/sign-pdf-iphone-without-printing/)を参照してください。SignDocsは別の署名済みコピーを作るため、編集画面だけでなく書き出したファイルも確認します。

## 何が変わる処理なのか

紙背景の除去で変わるのは署名の画像です。署名するPDFの本文やレイアウトは編集しません。また本人確認や、証明書を使うデジタル署名を提供するものでもありません。

切り抜きと背景除去はiPhoneまたはiPadで行うため、そのために署名をウェブサイトへ送信する必要はありません。完成したPDFの共有は別の操作であり、選んだ送信先に文書のコピーが渡ります。
