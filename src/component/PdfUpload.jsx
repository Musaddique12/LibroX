import { client } from "filestack-react";

// export const handleUpload = async (file) => {
//   try {
//     const filestackClient = client.init('A5OiZtOJ3QymnEaQOUJFFz'); // Replace with your Filestack API key
//     // Upload the single file
//     const result = await filestackClient.upload(file);
//     return result.url
//   } catch (error) {
//     console.error('Error uploading PDF:', error);
//   }
// };

export const handleUpload = async (file) => {
const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", "LibroX");

      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dy0p6iio6/auto/upload",
        {
          method: "POST",
          body: data,
        }
      );

      const uploadedImageURL = await res.json();
      console.log(uploadedImageURL);
      console.log(uploadedImageURL.secure_url);
      return uploadedImageURL.secure_url;
}
