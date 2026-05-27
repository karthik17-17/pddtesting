import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("NeuroStay Backend Running");
});

app.get("/api/test", (req, res) => {
  res.json({
    success: true,
    message: "NeuroStay API Working"
  });
});

export default app;