import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.render("profilepic");
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

app.post("/uploads", upload.single("image"), (req, res) => {
  console.log(req.body);
  console.log(req.file);
  res.redirect("/");
});

app.get("/uploads/:filename", (req, res) => {
  const filename = req.params.filename;
  const location = path.join(__dirname, "uploads", filename);

  res.download(location, filename, (err) => {
    if (err) {
      console.error("Download error:", err);
      res.status(404).send("File not found");
    } else {
      console.log("File transfer finished (sent to client)");
    }
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
