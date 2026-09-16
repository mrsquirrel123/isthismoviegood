import './globals.css'
import type { Metadata } from 'next'
export const metadata:Metadata={title:'Is This Movie Good?','description':'Quick movie answers. No spoilers.'}
export default function RootLayout({children}:{children:React.ReactNode}){return <><header className="nav"><a className="logo" href="/">isthis<span>movie</span>good.com</a><nav className="navlinks"><a href="/">Home</a><a href="/about">How It Works</a></nav></header>{children}</>}
