import React, { useEffect, useState } from 'react';
import { Upload, X, Image as ImageIcon, Plus } from 'lucide-react';
import { Meal } from '@/Types/types';
import axiosClient from '@/helpers/axios-client';
import { webUrl } from '@/helpers/constants';

interface GalleryImage {
  id: number;
  url: string;
  title: string;
}

const defaultImages: GalleryImage[] = [
  {
    id: 1,
    url: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba',
    title: 'Mountain Landscape'
  },
  {
    id: 2,
    url: 'https://images.unsplash.com/photo-1682687221038-404670f09439',
    title: 'Ocean Sunset'
  },
  {
    id: 3,
    url: 'https://images.unsplash.com/photo-1682687220063-4742bd7fd538',
    title: 'City Streets'
  }
];

export default function CategoryGallary({selectedCategory,setShowImageGallary,fetchCategories}) {
  const [selectedImages, setSelectedImages] = useState<GalleryImage[]>(defaultImages);
  const [images,setImages] =useState([])
  useEffect(()=>{
    axiosClient.get('fileNames').then(({data})=>setImages(data))
  },[])
 

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  };

  const handleFiles = (files: File[]) => {
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            const newImage: GalleryImage = {
              id: Date.now(),
              url: e.target.result as string,
              title: file.name
            };
            setSelectedImages(prev => [...prev, newImage]);
          }
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removeImage = (id: number) => {
    setSelectedImages(prev => prev.filter(img => img.id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
  

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image) => (
          <div
            onClick={()=>{
                axiosClient.patch(`categories/${selectedCategory.id}`,{
                    image_url:image
                }).then(({data})=>{
                    setShowImageGallary(false)
                    fetchCategories()
                })
            }}
            key={image}
            className="group relative aspect-square rounded-lg cursor-pointer overflow-hidden border border-gray-200"
          >
            <img
              src={`${webUrl}/images/${image}`}
           
              className="w-full h-full object-cover "
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300">
           
            </div>
          </div>
        ))}
        <label className="cursor-pointer">
          <div className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center hover:border-gray-400 transition-colors">
            <div className="flex flex-col items-center">
              <Plus className="w-8 h-8 text-gray-400" />
              <span className="text-sm text-gray-500 mt-2">Add Media</span>
            </div>
            <input
              type="file"
              className="hidden"
              multiple
              accept="image/*"
              onChange={handleFileInput}
            />
          </div>
        </label>
      </div>
    </div>
  );
}