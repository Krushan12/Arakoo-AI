'use client';

import { useState, useEffect } from 'react';

interface PicsumImage {
  id: string;
  author: string;
  url: string;
  download_url: string;
}

export const useRandomProfileImage = () => {
  const [imageUrl, setImageUrl] = useState<string>('');

  useEffect(() => {
    const generateRandomImage = () => {
      // Use a random seed for consistent image per user
      const seed = Math.random().toString(36).substring(7);
      setImageUrl(`https://picsum.photos/seed/${seed}/200/200`);
    };
    
    generateRandomImage();
  }, []);

  return imageUrl;
};
