import express from "express";
import cookieParser from "cookie-parser";
import routes from "./routes";

const app = express();

const PORT = process.env.PORT ? Number(process.env.PORT) : 3001;

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendStatus(200);
});

app.use(routes);

app.listen(PORT, () => {
  console.log("Server started on port", PORT);
});
