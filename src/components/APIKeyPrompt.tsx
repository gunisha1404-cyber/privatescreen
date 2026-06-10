import { useState } from "react";

interface Props { onSetKey: (k: string) => void }

export default function APIKeyPrompt({ onSetKey }: Props) {
	const [val, setVal] = useState("");
	const [busy, setBusy] = useState(false);
	const [err, setErr] = useState("");

	const verify = async () => {
		const t = val.trim();
		if (!t) { setErr("Enter your Cerebras API key"); return; }
		setBusy(true); setErr("");
		try {
			const r = await fetch("https://api.cerebras.ai/v1/chat/completions", {
				method: "POST",
				headers: { "Content-Type": "application/json", Authorization: `Bearer ${t}` },
				body: JSON.stringify({ model: "gpt-oss-120b", messages: [{ role: "user", content: "ping" }], max_tokens: 1 }),
			});
			if (!r.ok) {
				const d = await r.json().catch(() => ({}));
				throw new Error((d as any).error?.message || `HTTP ${r.status}`);
			}
			onSetKey(t);
		} catch (e: any) { setErr(e.message || "Failed"); }
		finally { setBusy(false); }
	};

	return (
		<div className="key-prompt">
			<h1>𝔗𝔢𝔵𝔇𝔬𝔪𝔬𝔫𝔦𝔞𝔱𝔬𝔯</h1>
			<p>Enter your Cerebras API key</p>
			<input type="password" placeholder="csk-..." value={val}
				onChange={(e) => setVal(e.target.value)}
				onKeyDown={(e) => e.key === "Enter" && verify()} autoFocus />
			{err && <div className="error-msg">{err}</div>}
			<button onClick={verify} disabled={busy || !val.trim()}>{busy ? "Verifying..." : "Start"}</button>
		</div>
	);
}
