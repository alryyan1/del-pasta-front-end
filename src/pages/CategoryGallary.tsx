import React, { useEffect, useState } from 'react';
import { Plus, ArrowLeft } from 'lucide-react';
import axiosClient from '@/helpers/axios-client';
import { webUrl } from '@/helpers/constants';


interface CategoryGallaryProps {
  selectedCategory: { id: number; name: string; image_url: string } | null;
  setShowImageGallary: (show: boolean) => void;
  fetchCategories: () => void;
}

export default function CategoryGallary({selectedCategory, setShowImageGallary, fetchCategories}: CategoryGallaryProps) {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchImages();
  }, []);
 

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  };

  const handleFiles = (files: File[]) => {
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const formData = new FormData();
        formData.append('image', file);
        
        axiosClient.post(`categories/${selectedCategory?.id}/upload-image`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }).then(() => {
          // Refresh the images list after upload
          fetchImages();
        }).catch(error => {
          console.error('Error uploading image:', error);
          setError('Failed to upload image');
        });
      }
    });
  };

  const fetchImages = async () => {
    try {
      setLoading(true);
      console.log('Fetching images from fileNames endpoint...');
      const { data } = await axiosClient.get('fileNames');
      console.log('Received images data:', data);
      setImages(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching images:', err);
      setError('Failed to load images');
    } finally {
      setLoading(false);
    }
  };

  const handleImageSelect = async (imageName: string) => {
    if (!selectedCategory) {
      console.error('No category selected');
      return;
    }

    try {
      setLoading(true);
      console.log('Updating category:', selectedCategory.id, 'with image:', imageName);
      
      const response = await axiosClient.patch(`categories/${selectedCategory.id}/image-url`, {
        image_url: imageName
      });
      
      console.log('Update response:', response.data);
      setShowImageGallary(false);
      fetchCategories();
    } catch (error) {
      console.error('Error updating category image:', error);
      setError('Failed to update category image');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => setShowImageGallary(false)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Categories
          </button>
        </div>
        <h2 className="text-xl font-semibold mb-2">Select Image for: {selectedCategory?.name}</h2>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        {loading && (
          <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-4">
            Loading...
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.length === 0 && !loading ? (
          <div className="col-span-full text-center py-8 text-gray-500">
            No images found. Upload some images first.
          </div>
        ) : (
          images.map((image) => (
            <div
              onClick={() => handleImageSelect(image)}
              key={image}
              className="group relative aspect-square rounded-lg cursor-pointer overflow-hidden border border-gray-200 hover:border-blue-500 transition-colors"
            >
              <img
                src={`${webUrl}/images/${image}`}
                alt={image}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
                <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  Select
                </span>
              </div>
            </div>
          ))
        )}
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