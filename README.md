# PrivateScreen

A privacy-first screen recording and overlay tool. When screen sharing, the interface is only visible to you - not to the screen share viewer.

## Features

- **Screen Share Privacy** - Exclude app windows from screen capture (Windows `SetWindowDisplayAffinity` with `WDA_EXCLUDEFROMCAPTURE`)
- **Privacy Overlay** - Transparent overlay window visible only to you
- **Cerebras AI Integration** - Fast inference API built-in (model: `gpt-oss-120b`)

## Tech Stack

- **Frontend**: React 18 + TypeScript + TailwindCSS
- **Desktop**: Electron (WebView2 on Windows)
- **Build**: Vite
- **AI**: Cerebras API
- **Reference**: Built based on [OpenScreen](https://github.com/siddharthvaddem/openscreen) architecture

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build:win
```

## Architecture Reference

The app architecture is derived from OpenScreen (MIT License):
- `electron/main.ts` - Main process with capture protection IPC handlers
- `electron/capture-protection.ts` - Win32 API for excluding windows from capture
- `src/components/MainScreen.tsx` - React UI for privacy controls + AI integration
- `src/components/Overlay.tsx` - Transparent overlay excluded from capture
- `cerebras_client.py` - Python Cerebras API client
