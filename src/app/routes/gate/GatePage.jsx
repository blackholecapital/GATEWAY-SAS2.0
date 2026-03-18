import PageShell from '../PageShell.jsx'
import { gateManifest } from './gate.slots.js'
import GateLayout from './gate.layout.jsx'
import '../../../styles/overlay-theme.css'
import '../../../styles/slot-cards.css'
import '../../../styles/mapping-debug.css'

export default function GatePage() {
  return <PageShell manifest={gateManifest} Layout={GateLayout} />
}
