

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const usermodel = require("./models/user");

const app = express();
app.use(express.json());
app.use(cors());

// 🔹 Connect to MongoDB
mongoose
  .connect(
    "mongodb+srv://shahwezqureshi19_db_user:NyvwnJiZ5mdMKEU9@cluster0.ralwanz.mongodb.net/FYP"
  )
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// 🔹 LOGIN Route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await usermodel.findOne({ email });

    if (!user) {
      return res.json({ status: "error", message: "User not found" });
    }

    if (user.password !== password) {
      return res.json({ status: "error", message: "The password is incorrect" });
    }

    console.log("✅ User logged in successfully:", user.username);

    res.json({
      status: "success",
      user: {
        id: user._id,
        name: user.username,
        email: user.email,
        answers: {
          pastModifications: user.pastModifications,
          bodykitSpoiler: user.bodykitSpoiler,
          customPaintWrap: user.customPaintWrap,
          pastCustomPaintWrap: user.pastCustomPaintWrap,
          newRimsTyre: user.newRimsTyre,
          pastRimsTyre: user.pastRimsTyre,
          performanceEnhancements: user.performanceEnhancements,
          smartFeatures: user.smartFeatures,
        },
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// 🔹 REGISTER Route
app.post("/register", async (req, res) => {
  try {
    const user = await usermodel.create(req.body);

    console.log("✅ New user registered successfully:", user.username);

    res.json({
      status: "success",
      user: {
        id: user._id,
        name: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("❌ Registration error:", err);
    res.status(500).json({ error: "Registration failed", details: err });
  }
});

// 🔹 UPDATE ANSWERS Route
app.post("/update-answers", async (req, res) => {
  try {
    const {
      email,
      username,
      pastModifications,
      bodykitSpoiler,
      customPaintWrap,
      pastCustomPaintWrap,
      newRimsTyre,
      pastRimsTyre,
      performanceEnhancements,
      smartFeatures,
    } = req.body;

    const query = email ? { email } : { username };

    const updatedUser = await usermodel.findOneAndUpdate(
      query,
      {
        pastModifications,
        bodykitSpoiler,
        customPaintWrap,
        pastCustomPaintWrap,
        newRimsTyre,
        pastRimsTyre,
        performanceEnhancements,
        smartFeatures,
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ status: "error", message: "User not found" });
    }

    console.log("✅ Answers updated for:", updatedUser.email || updatedUser.username);
    res.json({
      status: "success",
      message: "Answers updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    console.error("❌ Update Answers Error:", err);
    res.status(500).json({ status: "error", message: "Failed to update answers" });
  }
});

// 🔹 Start Server
app.listen(3001, () => {
  console.log("🚀 Server is running on port 3001");
});
