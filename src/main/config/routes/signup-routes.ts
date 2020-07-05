import { Router } from 'express'

export default (router: Router): void => {
  router.post('/signup', (req, res): void => {
    res.json({ ok: 'ok' })
  })
}
