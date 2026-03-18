import PageShell from '../PageShell.jsx'
import { accountManifest } from './account.slots.js'
import AccountLayout from './account.layout.jsx'
import '../../../styles/overlay-theme.css'
import '../../../styles/slot-cards.css'
import '../../../styles/mapping-debug.css'

export default function AccountPage() {
  return <PageShell manifest={accountManifest} Layout={AccountLayout} />
}
