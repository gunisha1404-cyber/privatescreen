import { BrowserWindow } from "electron";
import { execFile } from "node:child_process";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const SCRIPT_PATH = join(__dirname, "native", "capture_protection.py");
const PYTHON_PATH = "C:\\Users\\vipul\\AppData\\Local\\Python\\bin\\python.exe";

function callPython(action: "exclude" | "include", hwnd: number): Promise<boolean> {
	return new Promise((resolve) => {
		const proc = execFile(PYTHON_PATH, [SCRIPT_PATH, action, String(hwnd)], {
			timeout: 5000,
			windowsHide: true,
		});
		let output = "";
		proc.stdout?.on("data", (data: string) => { output += data; });
		proc.on("close", (code: number | null) => {
			const success = code === 0 && output.includes(`${action}:true`);
			resolve(success);
		});
		proc.on("error", () => resolve(false));
	});
}

export async function excludeWindowFromCapture(win: BrowserWindow): Promise<boolean> {
	if (win.isDestroyed()) return false;
	const buf = win.getNativeWindowHandle();
	if (!buf || buf.byteLength === 0) return false;
	return callPython("exclude", buf.readUInt32LE(0));
}

export async function includeWindowInCapture(win: BrowserWindow): Promise<boolean> {
	if (win.isDestroyed()) return false;
	const buf = win.getNativeWindowHandle();
	if (!buf || buf.byteLength === 0) return false;
	return callPython("include", buf.readUInt32LE(0));
}
