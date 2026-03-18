import PageShell from '../PageShell.jsx'
import { perksManifest } from './perks.slots.js'
import PerksLayout from './perks.layout.jsx'
import '../../../styles/overlay-theme.css'
import '../../../styles/slot-cards.css'
import '../../../styles/mapping-debug.css'

export default function PerksPage() {
  return <PageShell manifest={perksManifest} Layout={PerksLayout} />
}
