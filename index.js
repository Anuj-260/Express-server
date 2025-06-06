const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;
let users = require("./MOCK_DATA.json");

// Middleware to parse JSON body
app.use(bodyParser.json());

// Routes

//Read All Users
app.get("/api/users", (req, res) => {
  return res.json(users);
});

// Read One User (Id Basis)
app.get("/api/users/:id", (req, res) => {
  const id = Number(req.params.id);
  const user = users.find((user) => user.id === id);
  return res.json(user);
});

// Post: Create User
app.post("/api/users", (req, res) => {
  const newUser = req.body;
  const newId = users[users.length - 1].id + 1;
  const userWithId = { id: newId, ...newUser };
  users.push(userWithId);
  fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Failed to save user" });
    }
    res
      .status(201)
      .json({ message: "User added successfully", user: userWithId });
  });
});

// Put: Update existing user
app.put("/api/users/:id", (req, res) => {
  const userId = Number(req.params.id);
  const updateData = req.body;

  // Find index of user
  const userIndex = users.findIndex((user) => user.id === userId);

  if (userIndex === -1) {
    return res.status(404).json({ error: "User not found" });
  }
  users[userIndex] = { ...users[userIndex], ...updateData };

  fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Failed to update user" });
    }
    res
      .status(200)
      .json({ message: "User updated successfully", user: users[userIndex] });
  });
});

// ✅ PATCH: Partially update user
app.patch("/api/users/:id", (req, res) => {
  const userId = Number(req.params.id);
  const updateFields = req.body;

  const userIndex = users.findIndex((user) => user.id === userId);

  if (userIndex === -1) {
    return res.status(404).json({ error: "User not found" });
  }

  // Update only provided fields
  users[userIndex] = { ...users[userIndex], ...updateFields };

  fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Failed to patch user" });
    }

    res
      .status(200)
      .json({ message: "User patched successfully", user: users[userIndex] });
  });
});

// Delete : Remove a uset by Id
app.delete("/api/users/:id", (req, res) => {
  const userId = Number(req.params.id);
  const userIndex = users.findIndex((user) => user.id === userId);
  if (userIndex === -1) {
    return res.status(404).json({ error: "User not found" });
  }
  // Remove user
  const deletedUser = users.splice(userIndex, 1)[0];

  fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Failed to delete user" });
    }
    res
      .status(200)
      .json({ message: "user deleted successfully", user: deletedUser });
  });
});

app.listen(PORT, () => console.log(`Server Started at port:${PORT}`));
