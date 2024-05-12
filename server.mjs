import express from "express";
import blockchainRouter from "./routes/blockchain-routes.mjs";

const app = express();

app.use(express.json());
app.use("/api/v1/blockchain", blockchainRouter);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Something is wrong!" });
});

const PORT = process.env.PORT || 5010;

app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));
