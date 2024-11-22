import { Document, Packer, Paragraph, TextRun } from "https://cdn.jsdelivr.net/npm/docx@7.1.0
import { saveAs } from "https://cdn.jsdelivr.net/npm/file-saver@2.0.5/dist/FileSaver.min.js";

document.addEventListener('DOMContentLoaded', () => {
    const editor = document.getElementById('editor');

    function modifyText(command, value = null) {
        document.execCommand(command, false, value);
    }

    function onFormatButtonClick(event, command) {
        modifyText(command);
        event.target.classList.toggle('active');
    }

    function saveAndClose() {
        debugger;
        const content = editor.innerHTML;
        debugger

        const inlineStyledContent = convertToInlineStyles(content);
        saveAsDocx(inlineStyledContent);
    }

    function convertToInlineStyles(html) {
        debugger
        const div = document.createElement('div');
        div.innerHTML = html;
        const elements = div.querySelectorAll('*');

        const styleWhitelist = [
            'font-size', 'font-weight', 'font-style', 'text-decoration', 'color', 'background-color',
            'text-align', 'vertical-align', 'list-style-type', 'margin-left', 'font-family'
        ];

        elements.forEach(element => {
            const computedStyle = window.getComputedStyle(element);
            let styleString = '';
            for (let i = 0; i < computedStyle.length; i++) {
                const key = computedStyle[i];
                if (styleWhitelist.includes(key)) {
                    styleString += `${key}:${computedStyle.getPropertyValue(key)};`;
                }
            }
            element.setAttribute('style', styleString);
        });

        return div.innerHTML;
    }

    function saveAsDocx(content) {
        debugger;
        const doc = new Document();
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = content;

        const paragraphs = [];
        tempDiv.childNodes.forEach(node => {
            if (node.nodeType === Node.TEXT_NODE) {
                paragraphs.push(new Paragraph({ children: [new TextRun(node.textContent)] }));
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                const style = window.getComputedStyle(node);
                const textRun = new TextRun({
                    text: node.textContent,
                    bold: style.fontWeight === "bold" || parseInt(style.fontWeight) > 500,
                    italic: style.fontStyle === "italic",
                    underline: style.textDecoration.includes("underline"),
                    strike: style.textDecoration.includes("line-through"),
                    color: style.color.replace("rgb", "").replace(/[^\d,]/g, ""),
                    size: convertFontSize(style.fontSize),
                    font: style.fontFamily.replace(/['"]/g, '')
                });
                paragraphs.push(new Paragraph({ children: [textRun] }));
            }
        });

        doc.addSection({
            properties: {},
            children: paragraphs,
        });

        Packer.toBlob(doc).then(blob => {
            saveAs(blob, "document.docx");
        });
    }

    function convertFontSize(size) {
        const sizeMap = {
            '8px': 16,
            '10px': 20,
            '12px': 24,
            '14px': 28,
            '18px': 36,
            '24px': 48,
            '36px': 72
        };
        return sizeMap[size] || 24; // Default to 12pt font size
    }

    window.onFormatButtonClick = onFormatButtonClick;
    window.modifyText = modifyText;
    window.saveAndClose = saveAndClose;
});
