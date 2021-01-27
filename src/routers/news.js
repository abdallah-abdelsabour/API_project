const express = require("express");
const multer = require("multer");
const router = new express.Router();
const auth = require("../middleware/auth.js");
const News = require("../models/news");



//////////////////////<<  create news >>///////////////////////
router.post("/news", auth, async (req, res) => {
  const news = new News({
    ...req.body,
    owner: req.reporters._id,
  });
  try {
    await news.save();
    res.status(200).send(news);
  } catch (error) {
    res.status(400).send(error);
  }
});

////////////////////////<<get new  by ID>>//////////////////

router.get("/news/:id", auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const news = await News.findOne({ _id, owner: req.reporters._id });
    if (!news) {
      return res.status(400).send("didnt get");
    }
    res.send(news);
  } catch (e) {
    res.status(500).send("error");
  }
});

///////<< edit by id>>/////////////////////////

router.patch("/news/:id", auth, async (req, res) => {
  const _id = req.params.id;
  const updates = Object.keys(req.body);
  console.log(updates);
  try {
    const news = await News.findOne({ _id, owner: req.reporters._id });

    if (!news) {
      return res.send("didnt get news");
    }
    updates.forEach((update) => (news[update] = req.body[update]));
    await news.save();
    res.status(200).send(news);
  } catch (e) {
    res.status(400).send(e);
  }
});
////////////////<<delete by ID>>////////////////////

router.delete("/news/:id", auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const news = await News.findOneAndDelete({ _id, owner: req.reporters._id });

    if (!news) {
      return res.send("didnt get news");
    }
    res.status(200).send(news);
  } catch (e) {
    res.status(500).send(e);
  }
});

///////////////////////<<< upload photo >>>//////////////////////////////

const uploads = multer({
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|jfif)$/)) {
      return cb(new Error(" upload image please "));
    }
    cb(undefined, true);
  },
});

router.post("/news/img/:id", auth, uploads.single("img"), async (req, res) => {
  const _id = req.params.id;
  try {
    const news = await News.findOne({ _id, owner: req.reporters._id });
    if (!news) {
      return res.status(400).send("error");
    }
    news.img = req.file.buffer;

    await news.save();
    res.status(200).send(news);
  } catch (e) {
    res.status(400).send("error");
  }
});

/////////////////<<<get all news>>/////////////////

router.get("/news", auth, async (req, res) => {
  try {
    const sort = {};
    if (req.query.sortBy) {
      const parts = req.query.sortBy.split(":");
      sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
    }
    await req.reporters
      .populate({
        path: "news",
        options: {
          limit: parseInt(req.query.limit),
          skip: parseInt(req.query.skip),
          sort: sort,
        },
      })
      .execPopulate();
    res.send(req.reporters.news);
  } catch (e) {
    res.status(500).send(e);
  }
});

module.exports = router;
