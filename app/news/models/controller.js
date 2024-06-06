const News = require('../models/news');

exports.getAllNews = async (req, res) => {
  try {
    const news = await News.findAll();
    res.status(200).json(news);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getNewsById = async (req, res) => {
  const newsId = req.params.id;
  try {
    const news = await News.findByPk(newsId);
    if (!news) {
      res.status(404).json({ error: 'News not found' });
    } else {
      res.status(200).json(news);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.createNews = async (req, res) => {
  const { title, content, avatar } = req.body;
  try {
    const newNews = await News.create({ title, content, avatar });
    res.status(201).json(newNews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.updateNews = async (req, res) => {
  const newsId = req.params.id;
  const { title, content, avatar } = req.body;
  try {
    const news = await News.findByPk(newsId);
    if (!news) {
      res.status(404).json({ error: 'News not found' });
    } else {
      await news.update({ title, content, avatar });
      res.status(200).json(news);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.deleteNews = async (req, res) => {
  const newsId = req.params.id;
  try {
    const news = await News.findByPk(newsId);
    if (!news) {
      res.status(404).json({ error: 'News not found' });
    } else {
      await news.destroy();
      res.status(204).end();
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
