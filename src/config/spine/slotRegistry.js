import { gateManifest } from '../../app/routes/gate/gate.slots.js'
import { vipManifest } from '../../app/routes/vip/vip.slots.js'
import { perksManifest } from '../../app/routes/perks/perks.slots.js'
import { accountManifest } from '../../app/routes/account/account.slots.js'

export const slotRegistry = {
  gate: gateManifest,
  vip: vipManifest,
  perks: perksManifest,
  account: accountManifest
}

export function getPageManifest(pageKey) {
  return slotRegistry[pageKey] || null
}
