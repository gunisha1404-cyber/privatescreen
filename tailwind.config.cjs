/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: "class",
	content: ["./src/**/*.{ts,tsx}", "./index.html"],
	theme: {
		extend: {
			colors: {
				border: "hsl(240 3.7% 15.9%)",
				input: "hsl(240 3.7% 15.9%)",
				ring: "hsl(142 76% 36%)",
				background: "hsl(0 0% 3.9%)",
				foreground: "hsl(0 0% 98%)",
				primary: { DEFAULT: "hsl(142 76% 36%)", foreground: "hsl(0 0% 98%)" },
				secondary: { DEFAULT: "hsl(240 3.7% 15.9%)", foreground: "hsl(0 0% 98%)" },
				muted: { DEFAULT: "hsl(240 3.7% 15.9%)", foreground: "hsl(240 5% 64.9%)" },
				accent: { DEFAULT: "hsl(240 3.7% 15.9%)", foreground: "hsl(0 0% 98%)" },
				card: { DEFAULT: "hsl(240 5% 8%)", foreground: "hsl(0 0% 98%)" },
			},
			borderRadius: { lg: "0.5rem", md: "calc(0.5rem - 2px)", sm: "calc(0.5rem - 4px)" },
		},
	},
	plugins: [require("tailwindcss-animate")],
};
