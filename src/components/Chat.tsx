import { useState, useRef, useEffect, useCallback } from "react";
import Bubble from "./Bubble";

interface Props { apiKey: string; onClearKey: () => void }
interface Msg { role: "user" | "assistant"; content: string }

const SYSTEM_PROMPT = { role: "system" as const, content: "You are a helpful, natural, and concise assistant. Respond conversationally like a friendly AI. Keep answers clear, direct, and easy to understand. Avoid markdown formatting unless needed. Never be overly verbose or technical." };

export default function Chat({ apiKey, onClearKey }: Props) {
	const [msgs, setMsgs] = useState<Msg[]>([]);
	const [input, setInput] = useState("");
	const [sending, setSending] = useState(false);
	const [showSet, setShowSet] = useState(false);
	const [opacity, setOpacity] = useState(1);
	const taRef = useRef<HTMLTextAreaElement>(null);
	const chatRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		(async () => {
			try {
				const a = (window as any).api;
				if (a) setOpacity(await a.getOpacity());
			} catch {}
		})();
	}, []);

	const scroll = () => { if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight; };
	useEffect(() => { scroll(); }, [msgs]);

	const send = useCallback(async () => {
		const t = input.trim();
		if (!t || sending) return;
		setSending(true);
		const userMsg: Msg = { role: "user", content: t };
		const next = [...msgs, userMsg];
		setMsgs(next);
		setInput("");
		if (taRef.current) taRef.current.style.height = "auto";
		try {
			const r = await fetch("https://api.cerebras.ai/v1/chat/completions", {
				method: "POST",
				headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
				body: JSON.stringify({
					model: "gpt-oss-120b",
					messages: [SYSTEM_PROMPT, ...next.map(m => ({ role: m.role, content: m.content }))],
				}),
			});
			if (!r.ok) {
				const d = await r.json().catch(() => ({}));
				throw new Error((d as any).error?.message || `HTTP ${r.status}`);
			}
			const d = await r.json();
			const reply = d.choices?.[0]?.message?.content || "";
			setMsgs(prev => [...prev, { role: "assistant", content: reply || "(no response)" }]);
		} catch (e: any) {
			setMsgs(prev => [...prev, { role: "assistant", content: `Error: ${e.message}` }]);
		} finally {
			setSending(false);
			taRef.current?.focus();
		}
	}, [input, sending, msgs, apiKey]);

	const adj = () => {
		const el = taRef.current;
		if (!el) return;
		el.style.height = "auto";
		el.style.height = Math.min(el.scrollHeight, 120) + "px";
	};

	const onOpacity = async (v: number) => {
		setOpacity(v);
		try {
			const a = (window as any).api;
			if (a) await a.setOpacity(v);
		} catch {}
	};

	return (
		<>
			<div ref={chatRef} className="chat-body" onClick={() => { if (showSet) setShowSet(false); }}>
				{msgs.length === 0 && <div className="empty-brand">𝔗𝔢𝔵𝔇𝔬𝔪𝔬𝔫𝔦𝔞𝔱𝔬𝔯</div>}
				{msgs.map((m, i) => <Bubble key={i} role={m.role} content={m.content} />)}
				{sending && <div className="recv-msg" style={{ opacity: 0.6 }}>...</div>}
			</div>

			{showSet && (
				<div className="settings-panel" onClick={(e) => e.stopPropagation()}>
					<label>Opacity</label>
					<div className="row">
						<input type="range" min="0.1" max="1" step="0.05"
							value={opacity} onChange={(e) => onOpacity(parseFloat(e.target.value))} />
						<span>{Math.round(opacity * 100)}%</span>
					</div>
					<div className="row">
						<button className="sec-btn" onClick={onClearKey}>Change API Key</button>
					</div>
				</div>
			)}

			<button className="settings-btn" onClick={() => setShowSet(!showSet)} title="Settings">⚙</button>

			<div className="input-bar">
				<textarea ref={taRef} value={input}
					onChange={(e) => { setInput(e.target.value); adj(); }}
					onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
					placeholder="Type something..." rows={1} disabled={sending} />
				<button onClick={send} disabled={sending || !input.trim()} title="Send">➤</button>
			</div>
		</>
	);
}
