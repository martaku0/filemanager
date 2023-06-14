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

function updateLineNumbers() {
    const textareaValue = document.getElementById("edit-area").value;
    const numberOfLines = textareaValue.split('\n').length;
    console.log(numberOfLines)
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