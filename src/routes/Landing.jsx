import LandingDesktop from './LandingDesktop.jsx'
import LandingMobile from './LandingMobile.jsx'

function isMobileDevice() {
  if (typeof window === 'undefined') return false
  const coarse = window.matchMedia?.('(pointer: coarse)')?.matches
  const narrow = window.matchMedia?.('(max-width: 980px)')?.matches
  const ua = typeof navigator !== 'undefined' && /Android|iPhone|iPad|iPod|Mobi/i.test(navigator.userAgent)
  return (coarse && narrow) || ua
}

export default function Landing() {
  return isMobileDevice() ? <LandingMobile /> : <LandingDesktop />
}
