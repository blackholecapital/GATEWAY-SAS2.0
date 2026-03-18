import { fmtTs, shortAddr } from '../../lib/format.js'
import '../../styles/Admin.css'

export default function LogsTable({ logs = [] }) {
  return (
    <div className="logs card">
      <div className="card-title">*** AUDIT LOGS (LAST 25) ***</div>
      <div className="logs-table">
        <div className="logs-row logs-head">
          <div>Time</div><div>Wallet</div><div>Result</div><div>Reason</div><div>IP</div><div>Tier</div>
        </div>
        {logs.map((l, i) => (
          <div key={i} className="logs-row">
            <div>{fmtTs(l.ts)}</div>
            <div>{shortAddr(l.address)}</div>
            <div className={l.ok ? 'ok' : 'bad'}>{l.ok ? 'OK' : 'FAIL'}</div>
            <div className="reason">{l.reason || '—'}</div>
            <div>{l.ipMasked || '—'}</div>
            <div>{l.tier || '—'}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
