import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useCategoryStore } from "@/stores/CategoryStore";
import { Stack } from "@mui/system";
import { IconButton, Tooltip } from "@mui/material";
import { Settings } from "lucide-react";
import CategoryGallary from "@/pages/CategoryGallary";
import { webUrl } from "@/helpers/constants";
import { toast } from "sonner";

const MealCategoryForm = () => {
  const { t } = useTranslation('addCategory');
  const [categoryName, setCategoryName] = useState("");
  const [categoryImage, setCategoryImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { fetchCategories, categories, add } = useCategoryStore((state) => state);
  const [showGallary, setShowGallary] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  console.log(previewImage, "Preview Image", "Name", categoryName);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!categoryName.trim()) {
      toast.error(t("validation.complete_all_fields"));
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Call the add function with name and optional file
      await add(categoryName.trim(), categoryImage || undefined);
      
      // Success feedback
      toast.success("Category added successfully!");
      
      // Reset form
      setCategoryName("");
      setCategoryImage(null);
      setPreviewImage(null);
      
      // Reset file input
      const fileInput = document.getElementById("categoryImage") as HTMLInputElement;
      if (fileInput) {
        fileInput.value = "";
      }
      
    } catch (error) {
      console.error('Error adding category:', error);
      toast.error("Failed to add category. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle image selection and create preview
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
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

      setCategoryImage(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      {showGallary ? (
        <CategoryGallary 
          fetchCategories={fetchCategories} 
          setShowImageGallary={setShowGallary} 
          selectedCategory={selectedCategory}
        />
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {/* Form Section */}
          <div
            dir="rtl"
            className="max-w-md mx-auto mt-10 p-4 bg-white shadow-md rounded-lg"
          >
            <h2 className="text-2xl font-bold mb-4 text-right">
              {t("form.add_meal_category")}
            </h2>
            <form onSubmit={handleSubmit}>
              {/* Category Name Input */}
              <div className="mb-4">
                <label
                  htmlFor="categoryName"
                  className="block text-sm font-medium text-gray-700 text-right"
                >
                  {t("form.category_name")}
                </label>
                <input
                  type="text"
                  id="categoryName"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  placeholder={t("form.enter_category_name")}
                  required
                  disabled={isSubmitting}
                />
              </div>

              {/* Image Upload */}
              <div className="mb-4">
                <label
                  htmlFor="categoryImage"
                  className="block text-sm font-medium text-gray-700 text-right"
                >
                  {t("form.category_image")} {t("(optional)")}
                </label>
                <input
                  type="file"
                  id="categoryImage"
                  accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                  onChange={handleImageChange}
                  className="mt-1 block w-full text-sm text-gray-900 border border-gray-300 rounded-md cursor-pointer bg-gray-50 p-2"
                  disabled={isSubmitting}
                />
                <p className="text-xs text-gray-500 mt-1 text-right">
                  Maximum file size: 2MB. Supported formats: JPEG, PNG, GIF, WebP
                </p>
              </div>

              {/* Image Preview */}
              {previewImage && (
                <div className="mb-4">
                  <p className="text-sm text-gray-700 text-right">
                    {t("form.image_preview")}
                  </p>
                  <img
                    src={previewImage}
                    alt={t("form.image_preview")}
                    className="w-full h-48 object-cover rounded-md mt-2"
                  />
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary text-white p-2 rounded-md shadow hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? t("Adding...") : t("form.add_category")}
              </button>
            </form>
          </div>

          {/* Categories List */}
          <div>
            <div className="grid grid-cols-3 gap-1">
              {categories.map((cat) => (
                <div key={cat.id}>
                  <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-[1.02]">
                    <img
                      src={cat.image_url ? `${webUrl}/images/${cat.image_url}` : '/placeholder-image.jpg'}
                      alt={cat.name}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="%23f3f4f6"/><text x="100" y="100" font-family="Arial" font-size="14" fill="%236b7280" text-anchor="middle" dominant-baseline="middle">No Image</text></svg>';
                      }}
                    />
                    <div className="p-4">
                      <Stack direction={'row'} justifyContent={'space-between'}>
                        <h3 className="text-lg flex items-center justify-center font-semibold text-gray-900">
                          {cat.name}
                        </h3>
                        <Tooltip title='Choose from gallery'>
                          <IconButton 
                            onClick={() => {
                              setSelectedCategory(cat);
                              setShowGallary(true);
                            }}
                          >
                            <Settings/>
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MealCategoryForm;
