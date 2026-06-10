const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
	minimize: () => ipcRenderer.invoke("minimize"),
	restore: () => ipcRenderer.invoke("restore"),
	close: () => ipcRenderer.invoke("close"),
	setOpacity: (v) => ipcRenderer.invoke("set-opacity", v),
	getOpacity: () => ipcRenderer.invoke("get-opacity"),
	getFloating: () => ipcRenderer.invoke("get-floating"),
	readCb: () => ipcRenderer.invoke("read-cb"),
	writeCb: (t) => ipcRenderer.invoke("write-cb", t),
	setKey: (k) => ipcRenderer.invoke("set-key", k),
	getKey: () => ipcRenderer.invoke("get-key"),
	clearKey: () => ipcRenderer.invoke("clear-key"),
	moveRight: () => ipcRenderer.invoke("move-right"),
	moveLeft: () => ipcRenderer.invoke("move-left"),
});
