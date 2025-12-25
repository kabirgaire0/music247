import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
    title: 'Music247 - Your Music, Anytime',
    description: 'A Spotify-like music streaming experience',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body>
                <Toaster
                    position="bottom-center"
                    toastOptions={{
                        style: {
                            background: '#282828',
                            color: '#fff',
                        },
                    }}
                />
                {children}
            </body>
        </html>
    )
}
