/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    yellow: '#f8ce34',
                    black: '#111111',
                    'yellow-hover': '#e6bc20',
                    green: '#60a259',
                    blue: '#0066da',
                    'gray-bg': '#f8fafc',
                }
            },
            fontFamily: {
                sans: ['Montserrat', 'sans-serif'],
                hand: ['"Gochi Hand"', 'cursive'],
            },
            backdropBlur: {
                'xs': '2px',
            }
        },
    },
    plugins: [],
}
