import { useRef, useState } from 'react'
import { trackEvent } from './analytics.js'

function storageKey(postId) {
  return `comments:${postId}`
}

function readComments(postId) {
  try {
    return JSON.parse(localStorage.getItem(storageKey(postId))) ?? []
  } catch {
    return []
  }
}

export function Comments({ postId }) {
  const [comments, setComments] = useState(() => readComments(postId))
  const [isOpen, setIsOpen] = useState(false)
  const [name, setName] = useState('')
  const [text, setText] = useState('')
  const viewSentRef = useRef(false)

  const toggle = () => {
    const opening = !isOpen
    setIsOpen(opening)
    if (opening && !viewSentRef.current) {
      viewSentRef.current = true
      trackEvent('view_comment', { postId, commentCount: comments.length })
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const body = text.trim()
    if (!body) return
    const comment = { id: Date.now(), name: name.trim() || 'Anonymous', body }
    const next = [...comments, comment]
    setComments(next)
    try {
      localStorage.setItem(storageKey(postId), JSON.stringify(next))
    } catch {
      /* storage unavailable */
    }
    trackEvent('add_comment', { postId, commentLength: body.length })
    setText('')
  }

  return (
    <section style={{ margin: '24px 0' }}>
      <button type="button" onClick={toggle}>
        {isOpen ? 'Hide comments' : `View comments (${comments.length})`}
      </button>

      {isOpen && (
        <div style={{ marginTop: 12 }}>
          {comments.length === 0 && <p style={{ color: '#777' }}>No comments yet. Be the first!</p>}
          {comments.map((comment) => (
            <div key={comment.id} style={{ borderLeft: '3px solid #ddd', paddingLeft: 12, marginBottom: 12 }}>
              <strong>{comment.name}</strong>
              <p style={{ margin: '4px 0' }}>{comment.body}</p>
            </div>
          ))}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <input placeholder="Your name" value={name} onChange={(event) => setName(event.target.value)} style={{ padding: 6 }} />
            <textarea
              required
              rows={3}
              placeholder="Write a comment"
              value={text}
              onChange={(event) => setText(event.target.value)}
              style={{ padding: 6 }}
            />
            <button type="submit" style={{ alignSelf: 'flex-start' }}>
              Add comment
            </button>
          </form>
        </div>
      )}
    </section>
  )
}
