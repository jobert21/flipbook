import * as pdfjsLib from "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.5.136/pdf.min.mjs";

pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.5.136/pdf.worker.min.mjs";

const pdfUrlInput = document.getElementById("pdfUrl");
const loadBtn = document.getElementById("loadBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const leftCanvas = document.getElementById("leftPage");
const rightCanvas = document.getElementById("rightPage");
const spread = document.getElementById("spread");
const statusEl = document.getElementById("status");

let pdfDoc = null;
let currentSpreadStart = 1;

function setStatus(message) {
  statusEl.textContent = message;
}

async function renderPage(pageNumber, canvas) {
  const ctx = canvas.getContext("2d");

  if (!pageNumber || pageNumber > pdfDoc.numPages) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    return;
  }

  const page = await pdfDoc.getPage(pageNumber);
  const viewport = page.getViewport({ scale: 1.2 });

  canvas.width = viewport.width;
  canvas.height = viewport.height;

  await page.render({
    canvasContext: ctx,
    viewport
  }).promise;
}

async function renderSpread(animationClass) {
  if (!pdfDoc) return;

  if (animationClass) {
    spread.classList.remove("flipping-next", "flipping-prev");
    spread.classList.add(animationClass);
    spread.addEventListener(
      "animationend",
      () => spread.classList.remove(animationClass),
      { once: true }
    );
  }

  const leftPage = currentSpreadStart;
  const rightPage = currentSpreadStart + 1;

  await Promise.all([
    renderPage(leftPage, leftCanvas),
    renderPage(rightPage, rightCanvas)
  ]);

  setStatus(
    `Showing pages ${leftPage}${
      rightPage <= pdfDoc.numPages ? `-${rightPage}` : ""
    } of ${pdfDoc.numPages}`
  );
}

async function loadPdf(url) {
  try {
    setStatus("Loading PDF...");
    pdfDoc = await pdfjsLib.getDocument(url).promise;
    currentSpreadStart = 1;
    await renderSpread();
  } catch (error) {
    setStatus(`Unable to load PDF: ${error.message}`);
  }
}

loadBtn.addEventListener("click", () => {
  const url = pdfUrlInput.value.trim();
  if (!url) {
    setStatus("Please provide a PDF URL.");
    return;
  }

  loadPdf(url);
});

nextBtn.addEventListener("click", async () => {
  if (!pdfDoc) return;
  if (currentSpreadStart + 2 <= pdfDoc.numPages) {
    currentSpreadStart += 2;
    await renderSpread("flipping-next");
  }
});

prevBtn.addEventListener("click", async () => {
  if (!pdfDoc) return;
  if (currentSpreadStart - 2 >= 1) {
    currentSpreadStart -= 2;
    await renderSpread("flipping-prev");
  }
});

loadPdf('/pdf');