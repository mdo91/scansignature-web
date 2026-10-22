---
translationKey: "sign-pdf-iphone-without-printing"
title: "如何在 iPhone 上签署 PDF 而不用打印"
description: "在 iPhone 上给现有 PDF 添加真实手写签名并另存签署副本，无需打印或重新扫描整份文件。"
publishedAt: "2026-10-22"
updatedAt: "2026-10-22"
topic: "签署 PDF"
primaryQuery: "iPhone 签署 PDF 不用打印"
image: "/mockup/place-signature.png"
imageAlt: "SignDocs 中放置在 PDF 上的手写签名。"
related: ["scan-handwritten-signature-iphone", "save-share-signed-pdf-iphone"]
sources: [{"title": "Signature Scan: Sign PDFs — App Store 产品说明", "url": "https://apps.apple.com/us/app/signature-scan-sign-pdfs/id6805875185"}, {"title": "Apple iPhone User Guide (iOS 26): Fill out and sign PDF forms in Preview", "url": "https://support.apple.com/guide/iphone/fill-out-and-sign-pdf-forms-iphd7e3c0c74/26/ios/26"}, {"title": "Apple iPhone User Guide (iOS 26): Save, rename, or move PDFs and images in Preview", "url": "https://support.apple.com/guide/iphone/save-rename-or-move-pdfs-and-images-iph0bd249ff4/26/ios/26"}]
status: "published"
---

你可以在 iPhone 上直接签署 PDF，无需打印：打开文件、添加签名、放到正确页面，再保存已签署副本。Apple 预览 App 支持签署 PDF 表单。如果想使用平时在纸上写的签名，Signature Scan: Sign PDFs（SignDocs）可以拍下笔迹、去除纸张背景，再放到 PDF 上。

以下 SignDocs 流程需要 iOS 26 或 iPadOS 26 及更新版本。它添加的是手写签名图像，不提供身份验证或基于数字证书的签名。

## 开始前的准备

将 PDF 保存在文件 App 能打开的位置。如果来自邮件附件，请先下载。查看哪些页面需要签名，以及接收方是否还要求用其他工具填写信息。签署 PDF 不会自动完成表单字段。

准备好 SignDocs 中已保存的签名，或准备干净纸张与笔，拍摄新的签名。

## 在 SignDocs 中使用手写签名

1. 选择从文件 App 打开已有 PDF。
2. 选中文件，核对标题和页数，避免签错版本。
3. 选择已保存签名，或从纸上拍摄。拍摄时使用相机引导框、裁剪，并比较 Clean、Balanced 和 Bold。
4. 选择包含签名栏的 PDF 页面。
5. 将签名拖到指定位置，捏合调整大小，不要遮住周围文字。
6. 以可读大小检查页面，再使用 **Save File** 创建新的已签署 PDF。
7. 打开保存的副本，发送前检查签名。

![PDF 上的手写签名位于 Save File 按钮上方。](/mockup/place-signature.png)

需要拍摄帮助时，请看[手写签名扫描指南](/blog/scan-handwritten-signature-iphone/)。目的是保留真实墨迹，而不是用手指画出另一个版本。

## 使用 Apple 的内置方法

如果表单还需要填写姓名、日期或其他答案，也要完成这些内容。签名图像不能替你填写其余字段。iOS 26 的预览 App 提供填写与签署工具；能满足要求时，可以直接在那里完成。

### 在预览中填写文字字段

1. 在预览中打开 PDF 表单。如果需要保留原件，编辑前通过文件名旁边的操作菜单选择**复制**，创建工作副本。
2. 选择**填写表单**控件。
3. 选择字段并输入信息。使用自动填充建议前，先确认内容是打算发送的正确资料。
4. 需要文本框或签名时使用**添加**。所列 Apple 指南解释 iOS 26 的相应控件。

逐项检查必填信息。在一个字段输入姓名不等于完成另一处签名栏，添加签名也不等于补齐空白文字字段。

### 先保存已填写表单，再决定签名方式

在预览中，返回操作会保存文件并回到主菜单。文件名旁的菜单也可以重命名。使用容易识别的名称，区分工作副本与原始空白表单。

如果要使用从纸上提取的笔迹，请通过文件 App 在 SignDocs 中打开填写好的 PDF，并确认已输入文字清晰可见，再放置保存的签名。上述 SignDocs 步骤针对签名图像，并不是编辑 PDF 表单字段的说明。如果必填文字仍缺失，请先回到填写步骤，不要急着再生成签署副本。

如果已经用预览添加签名，而且文件符合接收方要求，检查后分享即可。无需换一个 App 再加第二个签名。菜单位置可能随系统版本变化，请结合对应版本的 Apple 说明操作。

## 检查最终 PDF

检查导出文件，而不只是编辑画面。查看签名的大小、所在页面和可读性。确认没有缺页，并尝试在保存后重新打开。

SignDocs 会保留原始 PDF，另存已签署副本。为输出清晰命名，避免误发未签名原件。[保存和分享指南](/blog/save-share-signed-pdf-iphone/)介绍最后一步。

## 接收方要求数字证书签名怎么办

嵌入的手写签名图像与基于证书的数字签名不同。如果接收方或门户指定证书、身份检查或专用签署服务，请遵循其流程。不要认为添加图像就满足了该要求。

对于接受手写签名图像的日常文件，没有必要打印后再扫描整份文档；从原始 PDF 操作并保存独立的签署副本即可。
