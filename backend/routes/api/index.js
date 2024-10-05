const router = require('express').Router();
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const { restoreUser, setTokenCookie, requireAuth } = require('../../utils/auth.js');
const { User } = require('../../db/models');


router.use(restoreUser); //make sure this happens first ALWAYS

//login & logout
router.use('/session', sessionRouter);
//signup
router.use('/users', usersRouter);
//add new routes here (reservations, pets, etc.)



// GET /api/restore-user
router.get(
  '/restore-user',
  (req, res) => {
    return res.json(req.user);
  }
);

// GET /api/set-token-cookie
router.get('/set-token-cookie', async (_req, res) => {
  const user = await User.findOne({
    where: {
      username: 'demouser'
    }
  });
  setTokenCookie(res, user);
  return res.json({ user: user });
});

// GET /api/require-auth
router.get(
  '/require-auth',
  requireAuth,
  (req, res) => {
    return res.json(req.user);
  }
);

// Keep this route to test frontend setup
router.post('/test', function (req, res) {
  res.json({ requestBody: req.body });
});


router.post('/test', (req, res) => {
  res.json({ requestBody: req.body })
});





module.exports = router;