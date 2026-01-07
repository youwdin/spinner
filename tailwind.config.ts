import type { Config } from "tailwindcss";

export default <Partial<Config>>{
	theme: {
		extend: {
			colors: {
				navy: {
					50: '#f0f4ff',
					100: '#e0e8ff',
					200: '#c7d4fe',
					300: '#a5b8fc',
					400: '#818cf8',
					500: '#6366f1',
					600: '#4f46e5',
					700: '#4338ca',
					800: '#3730a3',
					900: '#1e1b4b',
					950: '#0a0e1a',
				},
			},
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'gradient-blue': 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)',
			},
			fontFamily: {
				sans: ['Inter', 'system-ui', 'sans-serif'],
			},
		},
	},
	mode: "jit",
	darkMode: "class",
	content: [
		"app/components/**/*.{vue,js,jsx,mjs,ts,tsx}",
		"app/layouts/**/*.{vue,js,jsx,mjs,ts,tsx}",
		"app/pages/**/*.{vue,js,jsx,mjs,ts,tsx}",
		"app/plugins/**/*.{js,ts,mjs}",
		"app/composables/**/*.{js,ts,mjs}",
		"app/utils/**/*.{js,ts,mjs}",
		"app/{A,a}pp.{vue,js,jsx,mjs,ts,tsx}",
		"app/{E,e}rror.{vue,js,jsx,mjs,ts,tsx}",
		"app/app.config.{js,ts,mjs}",
	],
	plugins: [],
	safelist: [
		{
			pattern: /(bg|text|border)-(background|surface)-(darkGrey|offWhite|white|grey|dark|light|low|mid|high)/,
		},
	],
};
