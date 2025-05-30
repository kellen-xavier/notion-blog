import '../styles/global.css'
import 'katex/dist/katex.css'
import Footer from '../components/footer'
import Features from '../components/spotifyPlayer'

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <Features />
      <Footer />
    </>
  )
}
