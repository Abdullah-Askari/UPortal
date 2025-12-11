
export const CLOUDINARY_CONFIG = {
  cloudName: 'dgmjolhbj',
  uploadPreset: 'dgmjolhbj',
};

// Upload image to Cloudinary
export const uploadToCloudinary = async (imageUri) => {
  const { cloudName, uploadPreset } = CLOUDINARY_CONFIG;
  
  if (cloudName === 'YOUR_CLOUD_NAME' || uploadPreset === 'YOUR_UPLOAD_PRESET') {
    throw new Error('Please configure your Cloudinary credentials in cloudinaryConfig.js');
  }

  const formData = new FormData();
  
  // Get file extension
  const uriParts = imageUri.split('.');
  const fileType = uriParts[uriParts.length - 1];

  formData.append('file', {
    uri: imageUri,
    type: `image/${fileType}`,
    name: `profile_${Date.now()}.${fileType}`,
  });
  formData.append('upload_preset', uploadPreset);
  formData.append('folder', 'profile_pictures');

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error.message);
    }

    return {
      url: data.secure_url,
      publicId: data.public_id,
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
};
