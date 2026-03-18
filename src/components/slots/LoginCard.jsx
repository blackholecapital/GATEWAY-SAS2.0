import { useState } from 'react'
import SlotBadge from '../mapping/SlotBadge.jsx'

export default function LoginCard({ slot, zone, debug }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  function onSubmit(e) {
    e.preventDefault()
    const name = username.trim() || 'guest'
    setMessage(`Mock login submitted for ${name}.`)
  }

  return (
    <article className="slot-card">
      {debug ? <SlotBadge slotId={slot.slotId} type={slot.type} zone={zone} visible={slot.visible} /> : null}
      <div className="slot-card-title">{slot.title || slot.label}</div>
      <div className="slot-card-body">{slot.body || 'Existing customers can log in here'}</div>
      <form className="login-card" onSubmit={onSubmit}>
        <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
        <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" />
        <button className="slot-btn" type="submit">
          {(slot.actions && slot.actions[0]?.label) || 'Login'}
        </button>
      </form>
      {message ? <div className="status-pill">{message}</div> : null}
    </article>
  )
}
