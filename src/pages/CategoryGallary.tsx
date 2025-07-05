import React, { useEffect, useState } from 'react';
import { X, Upload, Check } from 'lucide-react';
import { Category } from '@/Types/types';
import axiosClient from '@/helpers/axios-client';
import { webUrl } from '@/helpers/constants';
import { toast } from 'sonner';

interface CategoryGalleryProps {
  selectedCategory: Category;
  setShowImageGallary: (show: boolean) => void;
  fetchCategories: () => void;
}

interface ApiError {
  response?: {
    data?: {
      error?: string;
      errors?: Record<string, string[]>;
    };
  };
}

export default function CategoryGallary(props: CategoryGalleryProps) {
  const { selectedCategory, setShowImageGallary, fetchCategories } = props;
  
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState<string | null>(null);

  // Load available images on mount
  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get('categories/images');
      setImages(response.data.images || []);
    } catch (error) {
      console.error('Failed to load images:', error);
      toast.error('Failed to load images');
      setImages([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      uploadNewImage(files[0]);
    }
  };

  const uploadNewImage = async (file: File) => {
    try {
      setUploading(true);
      
      // Validate file type on frontend
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Please select a valid image file (JPEG, PNG, GIF, WebP)');
        return;
      }

      // Validate file size (2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Image size must be less than 2MB');
        return;
      }

      const formData = new FormData();
      formData.append('image', file);

      await axiosClient.post(`categories/${selectedCategory.id}/upload-image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Image uploaded successfully!');
      setShowImageGallary(false);
      fetchCategories();

    } catch (error) {
      console.error('Upload error:', error);
      const apiError = error as ApiError;
      const errorMessage = apiError.response?.data?.error || 
                          Object.values(apiError.response?.data?.errors || {}).flat().join(', ') || 
                          'Failed to upload image';
      toast.error(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const selectExistingImage = async (imageName: string) => {
    try {
      setProcessing(imageName);

      await axiosClient.patch(`categories/${selectedCategory.id}`, {
        name: selectedCategory.name,
        image_url: imageName
      });

      toast.success('Image updated successfully!');
      setShowImageGallary(false);
      fetchCategories();

    } catch (error) {
      console.error('Selection error:', error);
      const apiError = error as ApiError;
      const errorMessage = apiError.response?.data?.error || 
                          Object.values(apiError.response?.data?.errors || {}).flat().join(', ') || 
                          'Failed to update image';
      toast.error(errorMessage);
    } finally {
      setProcessing(null);
    }
  };

  const handleClose = () => {
    if (!uploading && !processing) {
      setShowImageGallary(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-sm w-full mx-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent mx-auto mb-4"></div>
            <p className="text-gray-600">Loading images...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Select Image for "{selectedCategory.name}"
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Choose from existing images or upload a new one
            </p>
          </div>
          <button
            onClick={handleClose}
            disabled={uploading || !!processing}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {/* Upload new image card */}
            <label className={`
              aspect-square border-2 border-dashed border-gray-300 rounded-lg 
              flex flex-col items-center justify-center cursor-pointer
              hover:border-blue-400 hover:bg-blue-50 transition-all
              ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
            `}>
              <input
                type="file"
                className="hidden"
                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                onChange={handleFileSelect}
                disabled={uploading || !!processing}
              />
              {uploading ? (
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent mx-auto mb-2"></div>
                  <span className="text-sm text-gray-600">Uploading...</span>
                </div>
              ) : (
                <div className="text-center">
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm font-medium text-gray-600">Upload New</span>
                  <span className="text-xs text-gray-400 block mt-1">
                    JPEG, PNG, GIF, WebP (Max 2MB)
                  </span>
                </div>
              )}
            </label>

            {/* Existing images */}
            {images.map((imageName) => (
              <div
                key={imageName}
                className={`
                  aspect-square rounded-lg overflow-hidden cursor-pointer
                  border-2 transition-all relative group
                  ${selectedCategory.image_url === imageName 
                    ? 'border-green-500 ring-2 ring-green-200' 
                    : 'border-gray-200 hover:border-blue-400'
                  }
                  ${processing === imageName ? 'opacity-50' : ''}
                  ${processing && processing !== imageName ? 'opacity-30' : ''}
                `}
                onClick={() => !processing && !uploading && selectExistingImage(imageName)}
              >
                <img
                  src={`${webUrl}/images/${imageName}`}
                  alt={imageName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23f3f4f6"/><text x="50" y="50" font-family="Arial" font-size="12" fill="%236b7280" text-anchor="middle" dominant-baseline="middle">Error</text></svg>';
                  }}
                />

                {/* Selection indicator */}
                {selectedCategory.image_url === imageName && (
                  <div className="absolute top-2 right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}

                {/* Processing indicator */}
                {processing === imageName && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
                  </div>
                )}

                {/* Hover overlay */}
                {!processing && selectedCategory.image_url !== imageName && (
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center">
                    <span className="text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      Select
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Empty state */}
          {images.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 text-gray-300">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={1} 
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No images available</h3>
              <p className="text-gray-500">Upload your first image to get started.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={handleClose}
            disabled={uploading || !!processing}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading || processing ? 'Processing...' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
}