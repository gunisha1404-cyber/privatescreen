import path from "node:path";
import { fileURLToPath } from "node:url";
import { app, BrowserWindow, ipcMain, session, clipboard, screen } from "electron";
import { execFile } from "node:child_process";
import fs from "node:fs";

const __dirname_ = path.dirname(fileURLToPath(import.meta.url));
process.env.APP_ROOT = path.join(__dirname_, "..");
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");

// preload MUST be CommonJS (.cjs) — Electron does NOT support ESM in preload scripts
const PRELOAD = path.join(process.env.APP_ROOT, "electron", "preload.cjs");

const PYTHON_PATH = "C:\\Users\\vipul\\AppData\\Local\\Python\\bin\\python.exe";
const SCRIPT_PATH = app.isPackaged
	? path.join(process.resourcesPath, "native", "capture_protection.py")
	: path.join(__dirname_, "native", "capture_protection.py");

function execPython(action, hwnd) {
	return new Promise((r) => {
		const p = execFile(PYTHON_PATH, [SCRIPT_PATH, action, String(hwnd)], { timeout: 5000, windowsHide: true });
		let o = "";
		p.stdout?.on("data", (d) => { o += d; });
		p.on("close", (c) => r(c === 0 && o.includes(`${action}:true`)));
		p.on("error", () => r(false));
	});
}

function protect(win) {
	try {
		if (win.isDestroyed()) return false;
		const b = win.getNativeWindowHandle();
		if (!b || b.byteLength === 0) return false;
		return execPython("exclude", b.readUInt32LE(0));
	} catch { return false; }
}

let win = null;
let key = null;
let opacity = 1;
let floating = false;
let topInterval = null;

const FULL_W = 520, FULL_H = 700;
const DOT_W = 120, DOT_H = 120;

function posFile() { return path.join(process.env.APP_ROOT, "pos.json"); }
function savePos() {
	try { if (win && !win.isDestroyed()) { const [x, y] = win.getPosition(); fs.writeFileSync(posFile(), JSON.stringify([x, y])); } }
	catch {}
}
function loadPos() {
	try { if (fs.existsSync(posFile())) return JSON.parse(fs.readFileSync(posFile(), "utf8")); } catch {}
	return null;
}

function keepTop() {
	if (!win || win.isDestroyed()) return;
	win.setAlwaysOnTop(true, 'screen-saver');
	win.moveTop();
}

function setFloatingMode(on) {
	if (!win || win.isDestroyed()) return;
	floating = on;
	if (on) {
		win.setMinimumSize(DOT_W, DOT_H);
		win.setMaximumSize(DOT_W, DOT_H);
		win.setBounds({ x: 0, y: 0, width: DOT_W, height: DOT_H });
		win.setBackgroundColor("#00000000");
		win.setTransparent(true);
		win.setHasShadow(false);
		win.setResizable(false);
		keepTop();
		if (topInterval) clearInterval(topInterval);
		topInterval = setInterval(keepTop, 2000);
	} else {
		if (topInterval) { clearInterval(topInterval); topInterval = null; }
		const p = loadPos();
		win.setMinimumSize(FULL_W, FULL_H);
		win.setMaximumSize(0, 0);
		win.setBounds({ x: p?.[0], y: p?.[1], width: FULL_W, height: FULL_H });
		win.setTransparent(false);
		win.setBackgroundColor("#000000");
		win.setHasShadow(true);
		win.setResizable(true);
		win.setContentProtection(true);
		keepTop();
	}
}

function createWindow() {
	const a = screen.getPrimaryDisplay().workArea;
	win = new BrowserWindow({
		width: FULL_W, height: FULL_H, minWidth: FULL_W, minHeight: FULL_H,
		x: a.x + a.width - FULL_W - 10, y: a.y + 20,
		frame: false, transparent: false, backgroundColor: "#000000",
		resizable: true, alwaysOnTop: true, skipTaskbar: true,
		hasShadow: true, show: false, opacity: 1,
		webPreferences: {
			preload: PRELOAD, nodeIntegration: false, contextIsolation: true, webSecurity: false, backgroundThrottling: false,
		},
	});

	win.once("ready-to-show", () => {
		if (win && !win.isDestroyed()) { win.show(); protect(win); win.setContentProtection(true); win.setAlwaysOnTop(true, 'screen-saver'); win.moveTop(); }
	});
	win.on("resize", savePos);
	win.on("move", savePos);
	win.on("close", (e) => { if (!app.isQuitting) { e.preventDefault(); win?.hide(); } });
	win.on("closed", () => { win = null; });

	if (VITE_DEV_SERVER_URL) win.loadURL(VITE_DEV_SERVER_URL);
	else win.loadFile(path.join(RENDERER_DIST, "index.html"));
}

ipcMain.handle("minimize", () => {
	if (!win || win.isDestroyed()) return false;
	setFloatingMode(true);
	win.setOpacity(opacity);
	return true;
});
ipcMain.handle("restore", () => {
	if (!win || win.isDestroyed()) return false;
	setFloatingMode(false);
	win.setOpacity(opacity);
	win.show();
	win.focus();
	return true;
});
ipcMain.handle("close", () => {
	win?.hide();
	return true;
});

ipcMain.handle("set-opacity", async (_, v) => {
	opacity = Math.max(0.1, Math.min(1, v));
	if (win && !win.isDestroyed()) { win.setOpacity(opacity); await protect(win); }
	return opacity;
});
ipcMain.handle("get-opacity", () => opacity);
ipcMain.handle("get-floating", () => floating);

ipcMain.handle("move-right", () => {
	if (!win || win.isDestroyed()) return;
	const a = screen.getPrimaryDisplay().workArea;
	win.setPosition(a.x + a.width - DOT_W, 0);
});
ipcMain.handle("move-left", () => {
	if (!win || win.isDestroyed()) return;
	const a = screen.getPrimaryDisplay().workArea;
	win.setPosition(a.x, 0);
});

ipcMain.handle("read-cb", () => clipboard.readText());
ipcMain.handle("write-cb", (_, t) => { clipboard.writeText(t); return true; });
ipcMain.handle("set-key", (_, k) => { key = k; return true; });
ipcMain.handle("get-key", () => key);
ipcMain.handle("clear-key", () => { key = null; return true; });

app.on("before-quit", () => { app.isQuitting = true; });
app.on("window-all-closed", () => {});
app.on("activate", () => {
	if (BrowserWindow.getAllWindows().length === 0) createWindow();
	else if (win) { setFloatingMode(false); win.show(); win.focus(); }
});

app.whenReady().then(() => {
	session.defaultSession.setPermissionRequestHandler((_wc, p, cb) => { cb(["clipboard-read", "clipboard-write"].includes(p)); });
	createWindow();
});
