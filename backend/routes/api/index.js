const router = require('express').Router();
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const animalsRouter = require('./animals.js');
const reservationsRouter = require('./reservations.js');
const reviewsRouter = require('./reviews.js');
const imagesRouter = require('./images.js');
const { restoreUser, setTokenCookie, requireAuth } = require('../../utils/auth.js');

router.use(restoreUser); //make sure this happens first ALWAYS

//login & logout
router.use('/session', sessionRouter);

//signup
router.use('/users', usersRouter);
//add new routes here (reservations, pets, etc.)

//animals
router.use('/animals', animalsRouter);

//reservations
router.use('/reservations', reservationsRouter);

//reviews
router.use('/reviews', reviewsRouter);

//images
router.use('/images', imagesRouter);


router.get('/test', requireAuth, (req, res, next) => {
  try {
    res.json({
      message: ':)'
    })
  } catch (error) {
    next(error)
  }
})

router.post('/test', (req, res) => {
  res.json({ requestBody: req.body })
});

module.exports = router;