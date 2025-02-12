require("dotenv").config();
const express = require("express");
const userRouter = require("./routes/userRoutes");
const sequelize = require("./config/database");

const app = express();
app.use(express.json());
app.use("/api/v1/users", userRouter);

// Start Server
const PORT = process.env.PORT || 3000;


(async () => {
  await sequelize.sync();
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})();