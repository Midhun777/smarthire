/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'job-primary': 'hsl(240, 70%, 50%)', // indigo
                'job-secondary': 'hsl(270, 70%, 50%)', // purple
                'job-accent': 'hsl(180, 70%, 40%)', // teal
                'job-neutral': 'hsl(210, 10%, 95%)', // light gray
                'job-dark': 'hsl(210, 10%, 15%)', // dark gray
            },
        },
    },
    plugins: [],
}

