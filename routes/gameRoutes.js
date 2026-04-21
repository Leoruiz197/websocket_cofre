const express = require('express');
const controller = require('../controllers/gameController');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/guess', auth, controller.guess);
router.get('/state/:deviceId', controller.getState);
router.post('/reset', auth, controller.reset);

module.exports = router;