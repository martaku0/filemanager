if (document.getElementById('new_dir_btn')) {
    document.getElementById('new_dir_btn').addEventListener('click', () => {
        document.getElementById('new_dir').open = true
        document.getElementById('overlay').style.display = 'block'
    })
}

if (document.getElementById('new_txt_btn')) {
    document.getElementById('new_txt_btn').addEventListener('click', () => {
        document.getElementById('new_txt').open = true
        document.getElementById('overlay').style.display = 'block'
    })
}

if (document.getElementById('multi_files_btn')) {
    document.getElementById('multi_files_btn').addEventListener('click', () => {
        document.getElementById('multi_files').open = true
        document.getElementById('overlay').style.display = 'block'
    })
}

if (document.getElementById('rename_btn')) {
    document.getElementById('rename_btn').addEventListener('click', () => {
        document.getElementById('rename_dir').open = true
        document.getElementById('overlay').style.display = 'block'
    })
}

if (document.getElementById('rename_file')) {
    document.getElementById('rename_file').addEventListener('click', () => {
        document.getElementById('rename_f').open = true
        document.getElementById('overlay2').style.display = 'block'
    })
}

function updateLineNumbers() {
    const textareaValue = document.getElementById("edit-area").value;
    const numberOfLines = textareaValue.split('\n').length;
    const lineNumbersHTML = Array.from(Array(numberOfLines), (_, index) => `<p>${index + 1}</p>`).join('');
    document.getElementById("editor-numbers").innerHTML = lineNumbersHTML;
}

if (document.getElementById("edit-area")) {
    document.getElementById("edit-area").onkeyup = function() {
        updateLineNumbers();
    }
    window.addEventListener("load", function() {
        updateLineNumbers();
    });
}

if (document.getElementById('font_up')) {
    document.getElementById('font_up').addEventListener('click', () => {
        let el = document.getElementById('editor-numbers')
        let style = window.getComputedStyle(el, null).getPropertyValue('font-size');
        let fontSize = parseFloat(style);
        el.style.fontSize = (fontSize + 2) + 'px';
        let el2 = document.getElementById('edit-area')
        el2.style.fontSize = (fontSize + 2) + 'px';
    })
}

if (document.getElementById('font_down')) {
    document.getElementById('font_down').addEventListener('click', () => {
        let el = document.getElementById('editor-numbers')
        let style = window.getComputedStyle(el, null).getPropertyValue('font-size');
        let fontSize = parseFloat(style);
        el.style.fontSize = (fontSize - 2) + 'px';
        let el2 = document.getElementById('edit-area')
        el2.style.fontSize = (fontSize - 2) + 'px';
    })
}

var colors = [{ bgc: 'rgb(255, 255, 255)', c: 'rgb(0, 0, 0)' }, { bgc: "rgb(0, 0, 0)", c: "rgb(255, 255, 255)" }, { bgc: "rgb(155, 205, 210)", c: "rgb(250, 240, 228)" }, { bgc: "rgb(241, 212, 229)", c: "rgb(0, 0, 0)" }]
if (document.getElementById('colors')) {
    document.getElementById('colors').addEventListener('click', () => {
        let el = document.getElementById("edit-area")
        let style = window.getComputedStyle(el, null).getPropertyValue('background-color')
        let pos = colors.map(e => e.bgc).indexOf(style);
        if (pos != colors.length - 1) {
            el.style.backgroundColor = colors[pos + 1].bgc
            el.style.color = colors[pos + 1].c
        } else {
            el.style.backgroundColor = colors[0].bgc
            el.style.color = colors[0].c
        }
    })
}

if (document.getElementById('saveSett')) {
    document.getElementById('saveSett').addEventListener('submit', function(event) {
        event.preventDefault();

        const editArea = document.getElementById('edit-area');
        const backgroundColor = getComputedStyle(editArea).backgroundColor;
        document.getElementById('bgColorInput').value = backgroundColor;
        const color = getComputedStyle(editArea).color;
        document.getElementById('colorInput').value = color;
        const fontSize = getComputedStyle(editArea).fontSize;
        document.getElementById('fontSizeInput').value = fontSize;

        this.submit();
    })
}