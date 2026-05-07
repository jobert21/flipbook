const path = require("path");
const fs = require("fs");
const express = require("express");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 4000;
const pdfPath = path.join(__dirname, "..", "assets", "book.pdf");

app.use(cors());

const frontendDir = path.join(__dirname, "..", "..", "viewer");
if (fs.existsSync(frontendDir)) {
  app.use(express.static(frontendDir));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/')) {
        next();
        return;
      }
    res.sendFile(path.join(frontendDir, 'index.html'));
  });
} else {
  console.warn(`Viewer frontend not found at ${frontendDir}. Please build the viewer first.`);
}


app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.get("/api/pdf", (req, res) => {
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
