import { useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient.js';

const VEGETABLE_IMAGES = {
  'Ampalaya Bonito': 'https://horizons-cdn.hostinger.com/5d8b7fd1-222d-4584-9341-4f99f322a590/cb78990524661996ddd14c6252f55489.jpg',
  'Tomato Diamante': 'https://images.unsplash.com/photo-1699356893076-179b8ef95dde?q=80&w=2000&auto=format&fit=crop',
  'Tomato': 'https://images.unsplash.com/photo-1699356893076-179b8ef95dde?q=80&w=2000&auto=format&fit=crop',
  'Broccoli buhos': 'https://images.unsplash.com/photo-1605565962525-4af3cce055a0?q=80&w=2000&auto=format&fit=crop',
  'Broccoli': 'https://images.unsplash.com/photo-1605565962525-4af3cce055a0?q=80&w=2000&auto=format&fit=crop',
  'Carrot': 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?q=80&w=2000&auto=format&fit=crop',
  'Carrots': 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?q=80&w=2000&auto=format&fit=crop',
  'Lettuce': 'https://images.unsplash.com/photo-1692722058268-de2189d3a51f?q=80&w=2000&auto=format&fit=crop',
  'Bell Pepper': 'https://images.unsplash.com/photo-1631038941092-6ff2eb07200f?q=80&w=2000&auto=format&fit=crop',
  'Cucumber': 'https://images.unsplash.com/photo-1571324706922-4ae11e1a0286?q=80&w=2000&auto=format&fit=crop',
  'Spinach': 'https://images.unsplash.com/photo-1652600737542-3e88ae8f598e?q=80&w=2000&auto=format&fit=crop',
  'Onion': 'https://images.unsplash.com/photo-1578922426864-d99c48111d19?q=80&w=2000&auto=format&fit=crop',
  'Garlic': 'https://images.unsplash.com/photo-1687199127986-5770a228b555?q=80&w=2000&auto=format&fit=crop',
  'Potato': 'https://images.unsplash.com/photo-1675501344642-92d35d90fe51?q=80&w=2000&auto=format&fit=crop'
};

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2000&auto=format&fit=crop';

export const useVegetableBackgroundImage = (vegetable) => {
  const [state, setState] = useState({
    imageUrl: FALLBACK_IMAGE,
    isLoading: true
  });

  useEffect(() => {
    if (!vegetable) return;

    let targetUrl = FALLBACK_IMAGE;
    
    if (vegetable.image) {
      // Use custom image from PocketBase if available
      targetUrl = pb.files.getUrl(vegetable, vegetable.image);
    } else if (vegetable.name) {
      // Fallback to mapped images based on name
      const vegetableName = vegetable.name;
      
      // Exact match
      if (VEGETABLE_IMAGES[vegetableName]) {
        targetUrl = VEGETABLE_IMAGES[vegetableName];
      } else {
        // Partial match
        const lowerName = vegetableName.toLowerCase();
        const match = Object.keys(VEGETABLE_IMAGES).find(key => 
          lowerName.includes(key.toLowerCase()) || key.toLowerCase().includes(lowerName)
        );
        if (match) {
          targetUrl = VEGETABLE_IMAGES[match];
        }
      }
    }

    setState(prev => ({ ...prev, isLoading: true }));

    // Preload image to ensure smooth transition
    const img = new Image();
    img.src = targetUrl;
    img.onload = () => {
      setState({
        imageUrl: targetUrl,
        isLoading: false
      });
    };
    img.onerror = () => {
      setState({
        imageUrl: FALLBACK_IMAGE,
        isLoading: false
      });
    };

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [vegetable]);

  return state;
};