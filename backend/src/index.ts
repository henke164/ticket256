import express from "express";
import cookieParser from "cookie-parser";
import routes from "./routes";
import cors from "cors";
import path from "path";

const app = express();

const PORT = process.env.PORT ? Number(process.env.PORT) : 3001;
const frontendPath = path.join(__dirname, "../../frontend/dist");
app.use(express.static(frontendPath));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(routes);

app.get(/.*/, (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

app.listen(PORT, () => {
  console.log("Server started on port", PORT);
});
