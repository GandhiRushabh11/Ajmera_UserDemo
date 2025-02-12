const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    port: 3306,
    logging: false,
  }
);
sequelize
  .authenticate()
  .then(() => console.log(`Database Connection established successfully.`))
  .catch((err) => console.log(`Unable to connect to the database`, err));

module.exports = sequelize;
