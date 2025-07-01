import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { Category } from '@/Types/types';
import axiosClient from '@/helpers/axios-client';
import { webUrl } from '@/helpers/constants';
import { toast } from 'sonner';

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

interface CategoryGalleryProps {
  selectedCategory: Category;
  setShowImageGallary: (show: boolean) => void;
  fetchCategories: () => void;
}

export default function CategoryGallary(props: CategoryGalleryProps) {
  const { selectedCategory, setShowImageGallary, fetchCategories } = props;
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    // Fetch available image files from the backend
    axiosClient
      .get('categories/images/files')
      .then(({ data }) => {
        setImages(data.files || []);
      })
      .catch(() => {
        toast.error('Failed to load available images');
        setImages([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
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
        uploadNewImage(file);
      } else {
        toast.error(`${file.name} is not a valid image file`);
      }
    });
  };

  const uploadNewImage = async (file: File) => {
    try {
      setIsUploading(true);
      
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('name', selectedCategory.name); // Keep the same name
      formData.append('image', file);

      // Use dedicated upload endpoint for file uploads
      await axiosClient.post(`categories/${selectedCategory.id}/upload-image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      toast.success('Category image updated successfully');
      setShowImageGallary(false);
      fetchCategories();
    } catch (error) {
      console.error('Error uploading category image:', error);
      const errorMessage = (error as ApiError)?.response?.data?.message || 'Failed to update category image';
      toast.error(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  const selectExistingImage = async (imageFilename: string) => {
    try {
      setIsUploading(true);

      // Send just the image_url for existing images
      await axiosClient.patch(`categories/${selectedCategory.id}`, {
        name: selectedCategory.name, // Keep the same name
        image_url: imageFilename, // Set the existing image filename
      });
      
      toast.success('Category image updated successfully');
      setShowImageGallary(false);
      fetchCategories();
    } catch (error) {
      console.error('Error updating category image:', error);
      const errorMessage = (error as ApiError)?.response?.data?.message || 'Failed to update category image';
      toast.error(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-600">Loading images...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Select Image for "{selectedCategory.name}"
        </h2>
        <p className="text-gray-600">
          Choose from existing images or upload a new one.
        </p>
      </div>

      {/* Loading overlay */}
      {isUploading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-700">Uploading image...</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image) => (
          <div
            onClick={() => !isUploading && selectExistingImage(image)}
            key={image}
            className={`group relative aspect-square rounded-lg cursor-pointer overflow-hidden border-2 transition-all duration-200 ${
              isUploading 
                ? 'border-gray-200 opacity-50 cursor-not-allowed' 
                : 'border-gray-200 hover:border-blue-500'
            }`}
            title={`Select ${image}`}
          >
            <img
              src={`${webUrl}/images/${image}`}
              alt={image}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" fill="%23f3f4f6"/><text x="50" y="50" font-family="Arial" font-size="12" fill="%236b7280" text-anchor="middle" dominant-baseline="middle">No Image</text></svg>';
              }}
            />
            {!isUploading && (
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300">
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-white text-sm font-medium bg-black bg-opacity-50 px-3 py-1 rounded">
                    Select
                  </span>
                </div>
              </div>
            )}
            
            {/* Current selection indicator */}
            {selectedCategory.image_url === image && (
              <div className="absolute top-2 right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
        ))}
        
        {/* Upload new image section */}
        <label className={`cursor-pointer ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
          <div className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center hover:border-blue-400 hover:bg-blue-50 transition-all duration-200">
            <div className="flex flex-col items-center text-center p-4">
              <Plus className="w-8 h-8 text-gray-400 mb-2" />
              <span className="text-sm text-gray-500 font-medium">Upload New</span>
              <span className="text-xs text-gray-400 mt-1">JPG, PNG, GIF, WebP</span>
              <span className="text-xs text-gray-400">Max 2MB</span>
            </div>
            <input
              type="file"
              className="hidden"
              accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
              onChange={handleFileInput}
              disabled={isUploading}
            />
          </div>
        </label>
      </div>

      {images.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No images available</h3>
          <p className="text-gray-500 mb-4">Start by uploading your first image.</p>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
        <button
          onClick={() => setShowImageGallary(false)}
          disabled={isUploading}
          className={`px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md transition-colors duration-200 ${
            isUploading 
              ? 'opacity-50 cursor-not-allowed' 
              : 'hover:bg-gray-50'
          }`}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}