/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                spotify: {
                    green: '#1DB954',
                    'green-light': '#1ed760',
                    black: '#121212',
                    'gray-900': '#181818',
                    'gray-800': '#282828',
                    'gray-700': '#3E3E3E',
                    'gray-600': '#535353',
                    'gray-400': '#b3b3b3',
                    'gray-300': '#d9d9d9',
                },
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
                'gradient-spotify': 'linear-gradient(transparent 0, rgba(0, 0, 0, .5) 100%)',
            },
        },
    },
    plugins: [],
}
