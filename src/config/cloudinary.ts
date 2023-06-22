import { v2 as cloudinary } from 'cloudinary';
import { environments } from '../constants/environments';

cloudinary.config({
  cloud_name: environments.CLOUDINARY_CLOUD_NAME,
  api_key: environments.CLOUDINARY_API_KEY,
  api_secret: environments.CLOUDINARY_API_SECRET
});

export const uploadFilesToCloudinary = async (filePaths: string[]) => {
  try {
    const uploadPromises = filePaths.map((filePath) => {
      return cloudinary.uploader.upload(filePath);
    });

    const results = await Promise.all(uploadPromises);

    console.log(results);

    // Handle the results
    results.forEach((result) => {
      if (result.public_id) {
        console.log(`File uploaded to Cloudinary. Public ID: ${result.public_id}`);
        console.log(`File URL: ${result.url}`);
      } else {
        console.log('Failed to upload file to Cloudinary');
      }
    });

    return results.map(image => image.secure_url)
  } catch (error) {
    console.error('Error uploading files to Cloudinary:', error);
  }
};

export default cloudinary;
