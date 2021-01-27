const express = require("express");
const router = new express.Router();
const Reporters = require("../models/reporters");
const auth = require("../middleware/auth.js");



///////create reporters //////////////


router.post("/reporters", async (req, res) => {
  const reporters = new Reporters(req.body);
  try {
    await reporters.save();
    const token = await reporters.generateToken();
    res.status(200).send({ reporters, token });
    console.log(token);
  } catch (e) {
    res.status(400).send(e);
  }
});
   ////////////////<<< return all reporters >>//////////////
router.get("/reporters", async (req, res) => {
  try {
    const reporters = await Reporters.find({});
    res.status(200).send(reporters);
  } catch (error) {
    res.status(500).send("error");
  }
});



//////////////////////////<<<< login to Account>>//////////////////////////////////

router.post("/reporters/login", async (req, res) => {
  try {
    const reporters = await Reporters.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await reporters.generateToken();
    res.send({ reporters, token });
  } catch (error) {
    res.status(400).send("error");
  }
});



//////////////////////////////<<get Profile >>//////////////////////////
router.get("/reporters/profile", auth, (req, res) => {
  try{
  res.send(req.reporters);
  }

  catch(e){

    res.send("error")
  }
});




// //////////////<< Logout >>////////////////////////////////////

router.post("/logout", auth, async (req, res) => {
  try {
    req.reporters.tokens = req.reporters.tokens.filter((ele) => {
      return ele.token !== req.token;
    });
    await req.reporters.save();
    res.send("logout successeffuly ");
  } catch (e) {
    res.status(400).send("error");
  }
});

////////////////////////<<Delete Account >>/////////////////////

router.delete("/reporters/:id", auth, async (req, res) => {
  console.log(req.params);
  const _id = req.params.id;
  try {
    const reporters = await Reporters.findByIdAndDelete(_id);
    if (!reporters) {
      return res.status(400).send("didnt delete");
    }
    res.status(200).send(reporters);
  } catch (e) {
    res.status(500).send("error");
  }
});

/////////////////// <<Logout All >>/////////////////////////////////

router.post("/logoutAll", auth, async (req, res) => {
  try {
    req.reporters.tokens = [];
    await req.reporters.save();
    res.send("logout all success");
  } catch (e) {
    res.status(500).send("please login");
  }
});



//////////////////////////// <<Update Account>>////////////////////////////

router.patch("/reporters/profile", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  console.log(updates);
  try {
    updates.forEach((update) => (req.reporters[update] = req.body[update]));
    await req.reporters.save();

    res.status(200).send(req.reporters);
  } catch (e) {
    res.status(400).send(e);
  }
});

module.exports = router;
