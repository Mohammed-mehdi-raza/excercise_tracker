const express = require('express');
const router = express.Router();
const { index, add, view, addExercise, viewLogs } = require('../controller/controllers.js');

router.get('/', index);

router.post('/api/users', add);

router.get('/api/users', view);

router.post('/api/users/:id/exercises', addExercise);

router.get('/api/users/:id/logs', viewLogs);

module.exports = router;