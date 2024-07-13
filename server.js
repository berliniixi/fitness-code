require("dotenv").config();
require("express-async-errors");

const express = require("express");
const cors = require("cors");
const app = express();

// middleware
const notFound = require("./middleware/not-found");
const auth = require("./middleware/authentication");

// route imports
const authRoute = require("./routes/auth");
const calendarRoute = require("./routes/calendar");

// connect configuration
const connectToDB = require("./db/connect");
const uri = process.env.URI;
const db_name = process.env.DB_NAME;
const url = `${uri}/${db_name}`;

// extra packages
app.use(cors());
app.use(express.json());

// routes
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/book-session", auth, calendarRoute);

app.use(notFound);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectToDB(url);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
