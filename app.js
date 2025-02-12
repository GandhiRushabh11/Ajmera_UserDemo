require("dotenv").config();
const express = require("express");
const userRouter = require("./routes/userRoutes");
const sequelize = require("./config/database");
const errorHandler = require("./middlewares/errorHandler");
const app = express();
app.use(express.json());

// Sync Database
sequelize.sync().then(() => console.log("Database synchronized"));

app.use("/api/v1/users", userRouter);

//Global Error Handler
app.use(errorHandler);
// Start Server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
