import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

<<<<<<< HEAD
export default cloudinary;
=======
export default cloudinary;
>>>>>>> 1e061faa48b29d975b4f2c516a5b3184d56ae42e
