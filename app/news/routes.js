const express = require('express');
const router = express.Router();
const newsController = require('./models/controller');

router.get('/api/news', newsController.getAllNews);
router.get('/api/news/:id', newsController.getNewsById);
router.post('/api/news', newsController.createNews);
router.put('/api/news/:id', newsController.updateNews);
router.delete('/api/news/:id', newsController.deleteNews);

module.exports = router;
