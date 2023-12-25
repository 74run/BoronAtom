// ProfilePhoto.tsx
import React from 'react';
import profileImage from './Gold.png'; // Import the PNG image

interface ProfilePhotoProps {
  // No need to pass photoUrl as a prop anymore
}

const ProfilePhoto: React.FC<ProfilePhotoProps> = () => (
  <div
    style={{  
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      borderRadius: '50%',
      overflow: 'hidden',
      width: '150px', // Adjust the size as needed
      height: '150px',
      border: '2px solid #fff', // Border color and thickness
    }}
  >
    <img
      src={profileImage} // Use the imported image directly
      alt="Profile"
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
      }}
    />
  </div>
);

export default ProfilePhoto;
