# 𝕿𝖊𝖝𝕯𝖔𝖒𝖔𝖓𝖎𝖆𝖙𝖔𝖗

> **A floating AI chat window — invisible to screen sharing.**

---

## What It Is

TexDomoniator is a privacy-first ChatGPT-like interface that runs as a floating window above all your apps. When you screen share, **they can't see it** — only you can.

---

## Features

| Capability | How |
|---|---|
| **👻 Invisible to screen share** | `SetWindowDisplayAffinity(WDA_EXCLUDEFROMCAPTURE)` — Electron native + Python fallback |
| **📌 Always on top** | `'screen-saver'` priority level — never gets buried, even in fullscreen |
| **🔮 Floating dot minimize** | Shrinks to a 120×120 floating dot (𝔗). Click to restore. ◀ ▶ buttons snap to screen edges |
| **🎚️ Opacity slider** | 10%–100% in settings panel |
| **🤖 AI chat** | Cerebras API (`gpt-oss-120b`) — fast inference, conversational responses |
| **🔑 API key prompt** | First launch asks for your Cerebras key, verifies it, stores in-memory only |
| **🖤 Dark theme** | Full black background, white text, Fraktur blackletter branding |
| **🪟 No taskbar icon** | `skipTaskbar: true` — stays out of your way |
| **📋 Copy support** | Select text with mouse, Ctrl+C — no button needed |
| **⚙️ Settings panel** | Opacity slider + Change API Key |

---

## Tech Stack

```
Frontend   → React 18 + TypeScript + TailwindCSS
Desktop    → Electron 41 (WebView2)
Build      → Vite 7 + vite-plugin-electron
AI         → Cerebras API (gpt-oss-120b)
Capture    → Win32 SetWindowDisplayAffinity + setContentProtection()
Packaging  → electron-builder + NSIS installer
```

---

## Getting Started

```powershell
# Install dependencies
npm install

# Run in dev mode (opens Electron window)
npm run dev

# Build installer
npm run build:win
# → release\Tex Installer 1.0.0.exe
```

---

## Usage

1. Launch the app → prompted for your **Cerebras API key**
2. Enter key → verified → chat interface appears
3. **Type a message** → AI responds (black bubble for you, grey for AI)
4. **Minimize** (click ✕ or brand text) → floating 120×120 dot appears
5. **◀ ▶** on floating dot → snap to left/right screen edge
6. **Click 𝔗** on floating dot → restore full window
7. **Settings** (⚙) → adjust opacity or change API key
8. **Close** (×) → hides window (Alt+Tab or restart to show again)

---

## Project Structure

```
privatescreen/
├── electron/
│   ├── main.ts                    # Main process (frameless, IPC, capture protection)
│   ├── preload.cjs                # Context bridge (MUST be .cjs — Electron no ESM)
│   ├── capture-protection.ts      # Win32 capture exclusion helpers
│   └── native/
│       └── capture_protection.py  # Python ctypes fallback
├── src/
│   ├── App.tsx                    # Root: key check → prompt/chat/floating dot
│   ├── main.tsx                   # React entry
│   ├── index.css                  # Dark theme styles
│   ├── types.ts                   # TypeScript types
│   ├── lib/
│   │   └── utils.ts              # Tailwind utility
│   ├── components/
│   │   ├── TitleBar.tsx           # Fraktur brand, minimize/close
│   │   ├── APIKeyPrompt.tsx       # First-launch API key entry
│   │   ├── Chat.tsx               # Messages, input bar, settings panel
│   │   ├── Bubble.tsx             # Chat message bubble + copy
│   │   └── ui/
│   │       └── sonner.tsx         # Toast notifications
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── tsconfig.json
```

---

## Critical Notes

| Note | Why |
|---|---|
| **Preload must be `.cjs`** | Electron does not support ESM in preload scripts. `.cjs` forces CommonJS regardless of `"type": "module"` in `package.json`. |
| **No `-webkit-app-region: drag`** | Avoids Windows snap popup — window is pinned to top-right, positioning is IPC-based. |
| **Chat persists on minimize** | Uses `display:none` instead of conditional unmount — messages are preserved. |
| **Model is fixed** | Always `gpt-oss-120b` — not user-configurable. |
| **API key is in-memory only** | Never written to disk. Passed via Electron IPC. |
| **Python fallback** | At `process.resourcesPath/native/capture_protection.py` in production builds. |

---

## License

Built on [OpenScreen](https://github.com/siddharthvaddem/openscreen) (MIT) architecture.  
TexDomoniator itself is MIT.
