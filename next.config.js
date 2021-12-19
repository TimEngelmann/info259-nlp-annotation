require("dotenv").config();

const ENV = process.env;

Object.keys(ENV)
  .filter((key) => key.indexOf("REACT_APP_FIREBASE") !== 0)
  .forEach((key) => delete ENV[key]);

module.exports = {
  env: ENV,
};
