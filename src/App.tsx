import { useState, useEffect, useCallback } from "react";
import APIKeyPrompt from "./components/APIKeyPrompt";
import Chat from "./components/Chat";
import TitleBar from "./components/TitleBar";

export default function App() {
	const [key, setKey] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);
	const [floating, setFloating] = useState(false);

	useEffect(() => {
		(async () => {
			try {
				const a = (window as any).api;
				if (!a) { setLoading(false); return; }
				const k = await a.getKey();
				if (k) setKey(k);
				const f = await a.getFloating();
				if (f) setFloating(true);
			} catch {}
			setLoading(false);
		})();
	}, []);

	useEffect(() => {
		const iv = setInterval(async () => {
			try {
				const a = (window as any).api;
				if (a) {
					const f = await a.getFloating();
					if (f !== floating) setFloating(f);
				}
			} catch {}
		}, 200);
		return () => clearInterval(iv);
	}, [floating]);

	const setKeyFn = useCallback((k: string) => {
		try { (window as any).api?.setKey(k); } catch {}
		setKey(k);
	}, []);

	const clearKey = useCallback(() => {
		try { (window as any).api?.clearKey(); } catch {}
		setKey(null);
	}, []);

	const minimize = useCallback(async () => {
		try {
			const a = (window as any).api;
			if (!a) return;
			const ok = await a.minimize();
			if (ok) setFloating(true);
		} catch {}
	}, []);

	const close = useCallback(async () => {
		try { await (window as any).api?.close(); } catch {}
	}, []);

	const restore = useCallback(async () => {
		try {
			const a = (window as any).api;
			if (a) { await a.restore(); setFloating(false); }
		} catch {}
	}, []);

	const moveRight = useCallback(async () => {
		try { await (window as any).api?.moveRight(); } catch {}
	}, []);

	const moveLeft = useCallback(async () => {
		try { await (window as any).api?.moveLeft(); } catch {}
	}, []);

	if (loading) return <div className="app-wrap" style={{ justifyContent: "center", alignItems: "center" }}><div style={{ color: "#fff", fontSize: 14 }}>...</div></div>;

	return (
		<>
			{floating && (
				<div className="floating-dot">
					<button className="dot-arrow left" onClick={moveLeft}>◀</button>
					<span className="dot-letter" onClick={restore}>𝔗</span>
					<button className="dot-arrow right" onClick={moveRight}>▶</button>
				</div>
			)}
			<div className="app-wrap" style={{ display: floating ? "none" : "flex" }}>
				<TitleBar onMinimize={minimize} onClose={close} />
				{key ? <Chat apiKey={key} onClearKey={clearKey} /> : <APIKeyPrompt onSetKey={setKeyFn} />}
			</div>
		</>
	);
}
