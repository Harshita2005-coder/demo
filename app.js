const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const Listing = require("./models/listing.js");

const app = express();
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));

async function main() {
  await mongoose.connect(MONGO_URL);
  console.log("connected to DB");
}

main()
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((err) => {
    console.log("Database connection error:", err);
  });

// Index route - show all listings
app.get("/listings", async (req, res) => {
  try {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  } catch (err) {
    console.log(err);
    res.status(500).send("Error fetching listings");
  }
});

// New Route - must be BEFORE /listings/:id
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

// Create Route
app.post("/listings", async (req, res) => {
  try {
    const newListing = new Listing({
      title: req.body.title,
      description: req.body.description,
      image: req.body.image,
      price: req.body.price,
      location: req.body.location,
      country: req.body.country,
    });
    await newListing.save();
    res.redirect("/listings");
  } catch (err) {
    console.log(err);
    res.status(500).send("Error creating listing");
  }
});

// Show route - must be AFTER /listings/new
app.get("/listings/:id", async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    res.render("listings/show.ejs", { listing });
  } catch (err) {
    console.log(err);
    res.status(500).send("Error fetching listing");
  }
});



app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
