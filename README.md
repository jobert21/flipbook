# Flipbook Workspace

This workspace has two separate projects:

- `api`: Express API that serves a PDF at `GET /pdf`
- `viewer`: Browser page that displays the PDF as a simple flipbook

## 1) API project

```bash
cd api
npm install
npm run dev
```

Place your PDF at:

`api/assets/book.pdf`

API URL:

`http://localhost:4000/pdf`

## 2) Viewer project

```bash
cd viewer
npm start
```

Open:

`http://localhost:5173`

The page defaults to loading from `http://localhost:4000/pdf`.
