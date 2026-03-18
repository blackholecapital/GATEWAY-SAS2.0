import { Link, useLocation } from 'react-router-dom'
import '../styles/Page.css'

export default function Denied() {
  const loc = useLocation()
  const reason = loc.state?.reason || 'You do not meet the current access requirements.'

  return (
    <div className="page">
      <div className="card page-card">
        <div className="card-title">ACCESS DENIED</div>
        <div className="card-sub">{reason}</div>
        <div className="row">
          <Link className="pill" to="/">Back to Gate</Link>
        </div>
      </div>
    </div>
  )
}
