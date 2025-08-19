import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import cloudinary from "../cloudinary/cloudinaryConfig.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "profile_pic_uploads", 
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  },
});

const upload = multer({ storage });

<<<<<<< HEAD
export default upload; 
=======
export default upload; 
>>>>>>> 1e061faa48b29d975b4f2c516a5b3184d56ae42e
