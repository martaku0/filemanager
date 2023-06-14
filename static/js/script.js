document.getElementById('new_dir_btn').addEventListener('click', () => {
    document.getElementById('new_dir').open = true
    document.getElementById('overlay').style.display = 'block'
})

document.getElementById('new_txt_btn').addEventListener('click', () => {
    document.getElementById('new_txt').open = true
    document.getElementById('overlay').style.display = 'block'
})

document.getElementById('multi_files_btn').addEventListener('click', () => {
    document.getElementById('multi_files').open = true
    document.getElementById('overlay').style.display = 'block'
})

if (document.getElementById('rename_btn')) {
    document.getElementById('rename_btn').addEventListener('click', () => {
        document.getElementById('rename_dir').open = true
        document.getElementById('overlay').style.display = 'block'
    })
}