import { Hono } from 'hono'
import { parse } from './utils/parse'
const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.post('/match', async (c) => {
  const body = await c.req.text()
  const result = parse(body)
  if (result) {
    return c.json(result)
  }
  return c.json({ error: 'No content found' })
})

export default app
