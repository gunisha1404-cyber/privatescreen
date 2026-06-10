export {};

declare global {
	interface Window {
		electronAPI: {
			minimize: () => void;
			close: () => void;
			isVisible: () => Promise<boolean>;
			toggleCaptureProtection: () => Promise<boolean>;
			getCaptureStatus: () => Promise<boolean>;
			toggleTransparency: () => Promise<boolean>;
			getTransparency: () => Promise<boolean>;
			clipboardRead: () => Promise<string>;
			clipboardWrite: (text: string) => Promise<void>;
			storeApiKey: (key: string) => Promise<boolean>;
			getApiKey: () => Promise<string | null>;
			clearApiKey: () => Promise<boolean>;
		};
	}
}
