module.exports = {
	mode: 'jit',
	purge: ['./public/index.html', './src/**/*.svelte'],
	darkMode: false, // or 'media' or 'class'
	theme: {
		extend: {
			fontFamily: {
				roboto: "'Roboto', sans-serif",
				teko: "'Teko', sans-serif"
			},
			screens: {
				xs: '460px',
				xxs: '380px'
			},
			colors: {
				bgBlue: '#1f293e',
				bgBluelight: '#344568',
				bgBluedark: '#141B29',
				orange: '#FF6A00'
			}
		}
	},
	variants: {
		extend: {}
	},
	plugins: []
};
