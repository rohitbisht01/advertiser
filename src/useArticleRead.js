import { useEffect, useRef } from 'react'
import { trackEvent } from './analytics.js'

const READ_TIME_MS = 15000

export function useArticleRead(post) {
  const endRef = useRef(null)
  const sentRef = useRef(false)

  useEffect(() => {
    const send = (trigger) => {
      if (sentRef.current) return
      sentRef.current = true
      trackEvent('article_read', { postId: post.id, title: post.title, trigger })
    }

    const timer = setTimeout(() => send('time'), READ_TIME_MS)
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) send('scroll')
    })
    if (endRef.current) observer.observe(endRef.current)

    return () => {
      clearTimeout(timer)
      observer.disconnect()
    }
  }, [post.id, post.title])

  return endRef
}
