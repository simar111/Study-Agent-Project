const express =
  require("express");

const cors =
  require("cors");

const helmet =
  require("helmet");

const morgan =
  require("morgan");

const cookieParser =
  require("cookie-parser");

const env =
  require("./config/env");

const apiRoutes =
  require("./routes");

const errorHandler =
  require(
    "./middlewares/error.middleware"
  );

const notFound =
  require(
    "./middlewares/notFound.middleware"
  );

const app = express();

app.use(helmet());

app.use(
  cors({
    origin:
      env.CLIENT_URL,

    credentials: true,
  })
);

app.use(morgan("dev"));

app.use(
  express.json({
    limit: "10mb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(cookieParser());

app.get(
  "/api/v1/health",
  (req, res) => {
    res.status(200).json({
      success: true,
      message:
        "StudySphere API is running",
    });
  }
);

app.use(
  "/api/v1",
  apiRoutes
);

app.use(notFound);

app.use(errorHandler);

module.exports = app;