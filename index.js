require("dotenv").config();

const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const app = express();
//db connection
const DB = process.env.DB_SECRET;

app.use(express.json());

const posts = [
  { email: "nthangal@facebook.com", title: "post1" },
  { email: "joy@facebook.com", title: "post2" },
];

// mongoose
mongoose
  .connect(DB)
  .then(() => console.log("connected successfully to db"))
  .catch((err) => console.log("no connection"));

var User = require("./models/user");
var Post = require("./models/post");

app.get("/users", async (req, res) => {
  const users = await User.find({});
  try {
    res.json(users);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get("/posts", async (req, res) => {
  const users = await Post.find({});
  try {
    res.json(users);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post("/posts", authenticationToken, (req, res) => {
  console.log("req.user", req.user);
  try {
    const post = {
      title: req.body.title,
      description: req.body.description,
      number_of_dogs: req.body.number_of_dogs,
      dog_behaviour: req.body.dog_behaviour,
      image: req.body.image,
      user_email: req.user.email,
      coords: {
        latitude: req.body.coords.latitude,
        longitude: req.body.coords.longitude,
      },
      created_time: new Date(),
    };
    var newPost = new Post(post);
    newPost.save();
    res.status(201).send();
  } catch (error) {
    res.status(500).send();
  }
});

app.post("/register", async (req, res) => {
  const isNewUser = await User.isThisEmailInUse(req.body.email);
  if (isNewUser)
    return res.json({
      success: false,
      message: "This email is already in use.",
    });
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = {
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    };
    var newUser = new User(user);
    newUser.save();
    res.status(201).send();
  } catch (error) {
    res.status(500).send();
  }
});

app.post("/login", async (req, res) => {
  User.findOne({ email: req.body.email }, async (err, user) => {
    if (err) {
      console.log(err);
      return res.status(500).send();
    }
    if (!user) {
      return res.status(404).send();
    }

    try {
      if (await bcrypt.compare(req.body.password, user.password)) {
        const userData = { email: req.body.email };
        const accessToken = jwt.sign(userData, process.env.ACCESS_TOKEN_SECRET);
        res.json({ accessToken: accessToken });
        // res.send("success");
      } else {
        res.send("No allowed");
      }
    } catch (error) {
      res.status(500).send();
    }
  });
});

function authenticationToken(req, res, next) {
  console.log("token");
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, user) => {
    if (error) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

app.listen(3000);
