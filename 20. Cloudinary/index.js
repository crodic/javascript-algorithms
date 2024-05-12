import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary,
    allowedFormats: ['jpg', 'png', 'jpeg', 'webp'], // allowed image type
    params: {
        folder: 'template',
    },
});

const parser = multer({ storage: storage });

export default parser;

// How to use

// -------------------------------------------------

// 1. Multiple Input File

// router.post(
//     '/',
//     parser.fields([
//         {
//             name: 'mainImage',
//             maxCount: 1,
//         },
//         { name: 'banner', maxCount: 1 },
//         { name: 'subImage', maxCount: 20 },
//     ]),
//     movieController.createMovie
// );

// -----------------------------------------------------

// 2. One Image

// parser.single('avatar')

// -----------------------------------------------------

// 3. Multiple Images

// parser.array("name", 10)
