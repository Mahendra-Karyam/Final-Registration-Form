const express = require("express");
const cors = require("cors");
const { signUp_User, login_User } = require("./account.js");
const { User, connectToMongoDB } = require("./database.js");
const { json } = require("stream/consumers");
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());
connectToMongoDB();

app.get('/', (req, res) => {
  res.send('Server is running');
});

app.post('/signup', signUp_User);

app.post('/login', login_User);

app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.listen(3000, () => {
    console.log("Server is now running on http://localhost:3000")
})