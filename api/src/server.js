const path = require("path");
const fs = require("fs");
const express = require("express");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 4000;
const pdfPath = path.join(__dirname, "..", "assets", "book.pdf");

app.use(cors());

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.get("/pdf", (req, res) => {
  fs.access(pdfPath, fs.constants.R_OK, (error) => {
    if (error) {
      return res.status(404).json({
        error: "PDF not found. Add a file at api/assets/book.pdf"
      });
    }

    res.sendFile(pdfPath);
  });
});

app.listen(port, () => {
  console.log(`PDF API listening on http://localhost:${port}`);
});
