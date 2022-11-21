import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyparser from "body-parser";
import bodyParserErrorHandler from "express-body-parser-error-handler";
const userRouter = require("./controller/userController");
const recipeRouter = require("./controller/recipeController");
const port = process.env.PORT || 8080;
const monbgoDb = process.env.MONGO_DB_URI || "mongodb://127.0.0.1/dinnerDB";

const app = express();
mongoose.connect(monbgoDb);
var db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.use(bodyParserErrorHandler());
app.use(cors());

app.use("/api/users", userRouter);
app.use("/api/recipes", recipeRouter);

app.all('*', function (req, res) {
    res.status(404);
    res.json({ error: "not a valid request" });
});

app.listen(port, () =>
    console.log(`Your dinner server is running on port ${port}`)
); 