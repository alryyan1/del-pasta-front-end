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

export default function ImageGallery({selectedMeal,setShowImageGallary,fetchMeals}) {
  const [selectedImages, setSelectedImages] = useState<GalleryImage[]>(defaultImages);
  const [isDragging, setIsDragging] = useState(false);
  const [meals,setMeals] =useState<Meal[]>([])
  useEffect(()=>{
    axiosClient.get('fileNames').then(({data})=>setMeals(data))
  },[])
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

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
      {/* <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Media Library</h2>
        <div 
          className={`border-2 border-dashed rounded-lg p-8 text-center ${
            isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center">
            <Upload className="w-12 h-12 text-gray-400 mb-4" />
            <p className="text-xl font-medium text-gray-700 mb-2">
              Drop files to upload
            </p>
            <p className="text-sm text-gray-500 mb-4">
              or
            </p>
            <label className="cursor-pointer">
              <span className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors">
                Select Files
              </span>
              <input
                type="file"
                className="hidden"
                multiple
                accept="image/*"
                onChange={handleFileInput}
              />
            </label>
          </div>
        </div>
      </div> */}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {meals.map((image) => (
          <div
            onClick={()=>{
                axiosClient.patch(`meals/${selectedMeal.id}`,{
                    image_url:image
                }).then(({data})=>{
                    setShowImageGallary(false)
                    fetchMeals()
                })
            }}
            key={image}
            className="group relative aspect-square rounded-lg cursor-pointer overflow-hidden border border-gray-200"
          >
            <img
              src={`${webUrl}/images/${image}`}
              alt={image.name}
              className="w-full h-full object-cover "
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300">
              {/* <button
                onClick={() => removeImage(image.id)}
                className="absolute top-2 right-2 p-1 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                <X className="w-4 h-4 text-gray-600" />
              </button> */}
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