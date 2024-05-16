const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: "100mb" }));

mongoose.connect(
  "mongodb+srv://pavan:test@cluster0.cnwgtsg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
);

const postSchema = mongoose.Schema({
  name: String,
  image: {
    data: String,
    contentType: String,
  },
  permitted: Boolean,
});

const Post = new mongoose.model("post", postSchema);

//storage

const Storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

var upload = multer({ storage: Storage });

app.get("/uploads", (req, res) => {
  Post.find({}).then((data, err) => {
    if (err) {
      console.log(err);
    }
    res.json(data);
  });
});

app.post("/uploads", upload.single("image"), function (req, res) {
  console.log(req.body);
  const obj = {
    name: req.body.name,
    image: {
      data: req.body.image,
      contentType: "image/png",
    },
    permitted: false,
  };
  Post.create(obj).then((err, item) => {
    if (err) {
      console.log(err);
    } else {
      res.send("Image saved succesfully");
    }
  });
});

app.post("/delete", function (req, res) {
  const name = req.body.name;
  // Delete a document where the 'name' field is 'John'
  Post.deleteOne({ name: name })
    .then((result) => {
      console.log("Document deleted successfully");
      res.sendStatus(200);
    })
    .catch((err) => {
      console.error(err);
    });
});

app.get("/admin", function (req, res) {
  res.sendFile(__dirname + "/admin.html");
});

app.get("/user", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.listen(3000, function (req, res) {
  console.log("Server is running on port 3000");
});
