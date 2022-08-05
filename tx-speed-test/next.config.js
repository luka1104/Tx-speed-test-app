require("dotenv").config();

module.exports = {
  env: {
    PRIVATE_KEY: process.env.PRIVATE_KEY,
    PUBLIC_KEY: process.env.PUBLIC_KEY,
    TOKEN_ADDRESS: process.env.TOKEN_ADDRESS,
    API_URL: process.env.API_URL
  },
}