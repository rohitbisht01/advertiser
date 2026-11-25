import { Link, Route, Routes, useParams } from 'react-router-dom'
import { POSTS } from './posts.js'

const pageStyle = { maxWidth: 720, margin: '0 auto', padding: 16, fontFamily: 'Georgia, serif', lineHeight: 1.6 }

function Header() {
  return (
    <header style={{ borderBottom: '1px solid #ddd', marginBottom: 24 }}>
      <h1 style={{ margin: '8px 0' }}>
        <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>The Daily Notebook</Link>
      </h1>
    </header>
  )
}

function PostList() {
  return (
    <main>
      {POSTS.map((post) => (
        <article key={post.id} style={{ marginBottom: 24 }}>
          <h2 style={{ marginBottom: 4 }}>
            <Link to={`/blog/${post.id}`}>{post.title}</Link>
          </h2>
          <small style={{ color: '#777' }}>{post.date}</small>
          <p>{post.excerpt}</p>
        </article>
      ))}
    </main>
  )
}

function PostPage() {
  const { id } = useParams()
  const index = POSTS.findIndex((post) => post.id === id)
  const post = POSTS[index]

  if (!post) {
    return (
      <main>
        <p>Post not found.</p>
        <Link to="/">Back to all posts</Link>
      </main>
    )
  }

  const next = POSTS[(index + 1) % POSTS.length]

  return (
    <main>
      <Link to="/">← All posts</Link>
      <h2>{post.title}</h2>
      <small style={{ color: '#777' }}>{post.date}</small>
      {post.body.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
      <hr />
      <p>
        Next: <Link to={`/blog/${next.id}`}>{next.title}</Link>
      </p>
    </main>
  )
}

function App() {
  return (
    <div style={pageStyle}>
      <Header />
      <Routes>
        <Route path="/" element={<PostList />} />
        <Route path="/blog/:id" element={<PostPage />} />
      </Routes>
    </div>
  )
}

export default App
