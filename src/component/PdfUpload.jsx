import { client } from "filestack-react";

export const handleUpload = async (file) => {
  try {
    const filestackClient = client.init('A5OiZtOJ3QymnEaQOUJFFz'); // Replace with your Filestack API key
    // Upload the single file
    const result = await filestackClient.upload(file);
    return result.url
  } catch (error) {
    console.error('Error uploading PDF:', error);
  }
};