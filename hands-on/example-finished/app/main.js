const { app, BrowserWindow, Menu, dialog, nativeImage } = require('electron');
const path = require('path');
const url = require('url');

const menuTemplate = [
	{
		label: 'File',
		submenu: [
			{
				label: 'Open Images',
				accelerator: 'CmdOrCtrl+O',
				click(item, focusedWindow) {
					dialog.showOpenDialog(focusedWindow, { filters: [{ name: 'Images', extensions: ['jpg', 'png'] }], properties: ['openFile', 'multiSelections'] }, openImages);
				}
			}
		]
	},
	{
		label: 'View',
		submenu: [
			{
				label: 'Slow',
				accelerator: 'CmdOrCtrl+1',
				click() { updateInterval(30000); }
			},
			{
				label: 'Medium',
				accelerator: 'CmdOrCtrl+2',
				click() { updateInterval(10000); }
			},
			{
				label: 'Fast',
				accelerator: 'CmdOrCtrl+3',
				click() { updateInterval(2000); }
			},
			{
				type: 'separator'
			},
			{
				role: 'togglefullscreen',
				accelerator: 'F'
			},
			{
				role: 'toggledevtools',
				accelerator: 'F12'
			}
		]
	}
];

let window;

function createWindow() {
	window = new BrowserWindow({
		width: 1280,
		height: 720,
		backgroundColor: '#000'
	});

	window.loadURL(url.format({
		pathname: path.join(__dirname, 'index.html'),
		protocol: 'file',
		slashes: true
	}));

	window.on('close', () => {
		clearInterval(interval);
		window = null;
	});

	Menu.setApplicationMenu(Menu.buildFromTemplate(menuTemplate));

	window.on('resize', onResize);
	window.webContents.on('did-finish-load', onResize);
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

function onResize() {
	window.webContents.send('resize', { width: window.getContentSize()[0], height: window.getContentSize()[1] });
}

let imageQ = [];

function openImages(filePaths) {
	if (!filePaths) return;
	imageQ = filePaths;

	update();
	updateInterval(intervalTime);
}

function update() {
	if (!imageQ.length) return;

	const i = Math.floor(Math.random() * imageQ.length);
	window.webContents.send('show', imageQ[i]);

	const img = nativeImage.createFromPath(imageQ[i]);
	window.webContents.send('info', img.getSize().width + ' x ' + img.getSize().height + ' px');
}

let interval = null;
let intervalTime = 10000;

function updateInterval(iTime) {
	intervalTime = iTime;
	if (!imageQ.length) return;

	clearInterval(interval);
	interval = setInterval(update, intervalTime);
}
