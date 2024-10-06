const router = require('express').Router();
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const { restoreUser, setTokenCookie, requireAuth } = require('../../utils/auth.js');

router.use(restoreUser); //make sure this happens first ALWAYS

//login & logout
router.use('/session', sessionRouter);
//signup
router.use('/users', usersRouter);
//add new routes here (reservations, pets, etc.)

router.post('/test', (req, res) => {
  res.json({ requestBody: req.body })
});


// GET /api/restore-user
router.get(
  '/restore-user',
  (req, res) => {
    return res.json(req.user);
  }
);

module.exports = router;