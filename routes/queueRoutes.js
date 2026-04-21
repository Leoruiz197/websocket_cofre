const express = require('express');
const controller = require('../controllers/queueController');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/join', auth, controller.join);
router.post('/rejoin', auth, controller.rejoin);
router.post('/leave', auth, controller.leave);
router.get('/position/:deviceId', auth, controller.getMyPosition);
router.post('/start', auth, controller.start);
router.post('/finish', auth, controller.finish);

router.get('/:deviceId', controller.get);

module.exports = router;