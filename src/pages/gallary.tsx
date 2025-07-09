import React, { useEffect, useState } from 'react';
import { Plus, Loader2, AlertCircle } from 'lucide-react';
import { Meal } from '@/Types/types';
import axiosClient from '@/helpers/axios-client';
import { webUrl } from '@/helpers/constants';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

interface ImageGalleryProps {
  selectedMeal: Meal | null;
  setShowImageGallary: (show: boolean) => void;
  fetchMeals: () => void;
}

export default function ImageGallery({ selectedMeal, setShowImageGallary, fetchMeals }: ImageGalleryProps) {
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageLoading, setSelectedImageLoading] = useState<string | null>(null);

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const { data } = await axiosClient.get<string[]>('fileNames');
      setImages(data);
    } catch (err) {
      console.error('Error loading images:', err);
      setError('Failed to load images');
      toast.error('Failed to load images');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageSelect = async (imageName: string) => {
    if (!selectedMeal) {
      toast.error('No meal selected');
      return;
    }

    try {
      setSelectedImageLoading(imageName);
      await axiosClient.patch(`meals/${selectedMeal.id}`, {
        image_url: imageName
      });
      
      toast.success('Image updated successfully');
      setShowImageGallary(false);
      fetchMeals();
    } catch (err) {
      console.error('Error updating meal image:', err);
      toast.error('Failed to update image');
    } finally {
      setSelectedImageLoading(null);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      // Handle file upload logic here if needed
      console.log('Files selected:', files);
      toast.info('File upload functionality not implemented yet');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
        <span className="ml-2 text-gray-500">Loading images...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={loadImages} variant="outline">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Select Image</h2>
        <p className="text-gray-600">
          Choose an image for <span className="font-semibold">{selectedMeal?.name}</span>
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((imageName) => (
          <Card
            key={imageName}
            className="group relative aspect-square cursor-pointer overflow-hidden border-2 border-gray-200 hover:border-blue-500 transition-colors"
            onClick={() => handleImageSelect(imageName)}
          >
            <CardContent className="p-0 h-full">
              <div className="relative h-full">
                <img
                  src={`${webUrl}/images/${imageName}`}
                  alt={imageName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML = `
                        <div class="w-full h-full bg-gray-100 flex items-center justify-center">
                          <div class="text-center">
                            <svg class="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                            </svg>
                            <p class="text-xs text-gray-500">Failed to load</p>
                          </div>
                        </div>
                      `;
                    }
                  }}
                />
                
                {/* Loading overlay */}
                {selectedImageLoading === imageName && (
                  <div className="absolute inset-0 bg-opacity-50 flex items-center justify-center">
                    <Loader2 className="w-6 h-6 animate-spin text-white" />
                  </div>
                )}
                
                {/* Hover overlay */}
                <div className="absolute inset-0  bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-white rounded-full p-2">
                      <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {/* Add new image button */}
        <Card className="aspect-square cursor-pointer border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors">
          <CardContent className="p-0 h-full">
            <label className="cursor-pointer h-full flex items-center justify-center">
              <div className="flex flex-col items-center">
                <Plus className="w-8 h-8 text-gray-400" />
                <span className="text-sm text-gray-500 mt-2">Add Image</span>
              </div>
              <input
                type="file"
                className="hidden"
                multiple
                accept="image/*"
                onChange={handleFileUpload}
              />
            </label>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}