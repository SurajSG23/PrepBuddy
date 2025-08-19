import express from "express";
import upload from "../cloudinary/upload.js";

const router = express.Router();

router.post("/", upload.single("image"), async (req, res) => {
  try {
    const imageUrl = req.file.path;
    res.status(200).json({ url: imageUrl });
  } catch (err) {
    console.error(err);
    res.status(500).send("Upload failed");
  }
});

<<<<<<< HEAD
export default router;
=======
export default router;
>>>>>>> 1e061faa48b29d975b4f2c516a5b3184d56ae42e
