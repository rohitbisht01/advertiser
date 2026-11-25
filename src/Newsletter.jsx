import { useState } from 'react'
import { identifyUser, trackEvent } from './analytics.js'

const STORAGE_KEY = 'newsletter_email'

function readSubscribedEmail() {
  try {
    return localStorage.getItem(STORAGE_KEY) ?? ''
  } catch {
    return ''
  }
}

export function Newsletter({ source, postId }) {
  const [email, setEmail] = useState('')
  const [subscribedEmail, setSubscribedEmail] = useState(readSubscribedEmail)

  const handleSubmit = (event) => {
    event.preventDefault()
    const value = email.trim()
    if (!value || subscribedEmail) return
    identifyUser({ userId: value, email: value })
    trackEvent('newsletter_signup', { source, postId })
    try {
      localStorage.setItem(STORAGE_KEY, value)
    } catch {
      /* storage unavailable */
    }
    setSubscribedEmail(value)
  }

  return (
    <section style={{ background: '#f4f1ea', padding: 16, margin: '24px 0' }}>
      <h3 style={{ marginTop: 0 }}>Get new posts by email</h3>
      {subscribedEmail ? (
        <p style={{ margin: 0 }}>Thanks! {subscribedEmail} is subscribed.</p>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <input
            type="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            style={{ flex: 1, minWidth: 200, padding: 6 }}
          />
          <button type="submit">Subscribe</button>
        </form>
      )}
    </section>
  )
}
