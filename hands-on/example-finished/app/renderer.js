const ipc = require('electron').ipcRenderer;

ipc.on('resize', (event, data) => {
    document.getElementById('container').style.width = data.width + 'px';
    document.getElementById('container').style.height = data.height + 'px';
});

ipc.on('show', (event, data) => {
    document.getElementById('image').src = data;
});

ipc.on('info', (event, data) => {
    document.getElementById('info-text').textContent = data;
});
