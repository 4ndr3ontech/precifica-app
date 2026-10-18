import { Hono } from 'hono'
import { cors } from 'hono/cors'

// Definir a ligação com o D1
type Bindings = {
  DB: D1Database
}

const app = new Hono<{ Bindings: Bindings }>()

// Permitir que o Frontend comunique com o Backend (CORS)
app.use('/*', cors({
  origin: '*', // Num ambiente real de produção, coloque o URL do seu Cloudflare Pages aqui
  allowHeaders: ['Content-Type', 'Authorization'],
  allowMethods: ['POST', 'GET', 'OPTIONS'],
}))

app.get('/', (c) => c.text('API Precifica a rodar no Cloudflare Workers!'))

// ROTA: Simulação de Login (Para expandir com JWT mais tarde)
app.post('/api/login', async (c) => {
  const body = await c.req.json()
  // Aqui entraria a validação de password com bcrypt
  const { results } = await c.env.DB.prepare('SELECT id, email, plan FROM users WHERE email = ?').bind(body.email).all()
  
  if (results.length > 0) {
    return c.json({ success: true, user: results[0] })
  }
  return c.json({ success: false, message: 'Utilizador não encontrado' }, 401)
})

// ROTA: Guardar um cálculo no histórico
app.post('/api/calculations', async (c) => {
  const { userId, moduleName, inputs, results } = await c.req.json()
  const id = crypto.randomUUID()
  
  await c.env.DB.prepare(
    'INSERT INTO calculations (id, user_id, module_name, inputs, results) VALUES (?, ?, ?, ?, ?)'
  ).bind(id, userId, moduleName, JSON.stringify(inputs), JSON.stringify(results)).run()

  return c.json({ success: true, id })
})

// ROTA: Buscar o histórico de um utilizador
app.get('/api/calculations/:userId', async (c) => {
  const userId = c.req.param('userId')
  
  const { results } = await c.env.DB.prepare(
    'SELECT * FROM calculations WHERE user_id = ? ORDER BY created_at DESC'
  ).bind(userId).all()

  return c.json(results)
})

export default app