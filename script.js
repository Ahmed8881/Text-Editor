document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('editorForm');
    const category = document.getElementById('category');
    const title = document.getElementById('title');
    const categoryError = document.getElementById('categoryError');
    const titleError = document.getElementById('titleError');
    const editor = document.getElementById('editor');

    function modifyText(command, value = null) {
        document.execCommand(command, false, value);
    }

    function onFormatButtonClick(event, command) {
        modifyText(command);
        event.target.classList.toggle('active');
    }

    function saveAndClose() {
        if (!category.value) {
            categoryError.style.display = 'block';
        } else {
            categoryError.style.display = 'none';
        }

        if (!title.value) {
            titleError.style.display = 'block';
        } else {
            titleError.style.display = 'none';
        }

        if (category.value && title.value) {
            saveData();
            alert('Data saved and dialog closed');
        }
    }

    function saveData() {
        const content = editor.innerHTML;
        const inlineStyledContent = convertToInlineStyles(content);
        console.log('Saved content with inline styles:', inlineStyledContent);
    }

    function convertToInlineStyles(html) {
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
                    styleString += `${key}: ${computedStyle.getPropertyValue(key)}; `;
                }
            }
            if (element.tagName.toLowerCase() === 'font') {
                const size = element.getAttribute('size');
                if (size) {
                    styleString += `font-size: ${convertFontSize(size)}; `;
                }
                const face = element.getAttribute('face');
                if (face) {
                    styleString += `font-family: ${face}; `;
                }
                element.removeAttribute('size');
                element.removeAttribute('face');
                const spanElement = document.createElement('span');
                spanElement.innerHTML = element.innerHTML;
                spanElement.setAttribute('style', styleString);
                element.replaceWith(spanElement);
            } else if (styleString.trim()) {
                element.setAttribute('style', styleString);
            }
        });

        if (div.childNodes.length === 1 && div.firstChild.nodeType === Node.TEXT_NODE) {
            const wrapperDiv = document.createElement('div');
            wrapperDiv.innerHTML = div.innerHTML;
            return wrapperDiv.outerHTML;
        }

        return div.innerHTML;
    }

    function convertFontSize(size) {
        const sizeMap = {
            '1': '8px',
            '2': '10px',
            '3': '12px',
            '4': '14px',
            '5': '18px',
            '6': '24px',
            '7': '36px'
        };
        return sizeMap[size] || size;
    }

    window.onFormatButtonClick = onFormatButtonClick;
    window.modifyText = modifyText;
    window.saveAndClose = saveAndClose;
});