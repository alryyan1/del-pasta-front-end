import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useCategoryStore } from "@/stores/CategoryStore";
import { Stack } from "@mui/system";
import { IconButton, Tooltip } from "@mui/material";
import { Settings } from "lucide-react";
import ImageGallery from "@/pages/gallary";
import CategoryGallary from "@/pages/CategoryGallary";
import { webUrl } from "@/helpers/constants";

const MealCategoryForm = () => {
  const { t } = useTranslation('addCategory'); // Hook for translation
  const [categoryName, setCategoryName] = useState("");
  const [categoryImage, setCategoryImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const { fetchCategories, categories, add } = useCategoryStore((state) => state);
  const [showGallary, setShowGallary] = useState(false);

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);
    const [selectedCategory,setSelectedCategory] = useState(null)
  console.log(previewImage, "Preview Image", "Name", categoryName);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (!categoryName || !categoryImage) {
      alert(t("validation.complete_all_fields")); // Use translation for the alert
      return;
    }

    const formData = new FormData();
    formData.append("categoryName", categoryName);
    formData.append("categoryImage", categoryImage);

    console.log(t("log.category_name"), categoryName);
    console.log(t("log.image_uploaded"), categoryImage);

    add(categoryName, previewImage);

    setCategoryName("");
    setCategoryImage(null);
    setPreviewImage(null);
  };

  // Handle image selection and create preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCategoryImage(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
<>
   {showGallary ? <CategoryGallary fetchCategories={fetchCategories} setShowImageGallary={setShowGallary} selectedCategory={selectedCategory}/> :  <div className="grid grid-cols-2 gap-4">
      
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
            />
          </div>

          {/* Image Upload */}
          <div className="mb-4">
            <label
              htmlFor="categoryImage"
              className="block text-sm font-medium text-gray-700 text-right"
            >
              {t("form.category_image")}
            </label>
            <input
              type="file"
              id="categoryImage"
              accept="image/*"
              onChange={handleImageChange}
              className="mt-1 block w-full text-sm text-gray-900 border border-gray-300 rounded-md cursor-pointer bg-gray-50 p-2"
              required
            />
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
            className="w-full bg-primary text-white p-2 rounded-md shadow hover:bg-primary-dark"
          >
            {t("form.add_category")}
          </button>
        </form>
      </div>

      {/* Categories List */}
      <div>
        <div className="grid grid-cols-3 gap-1">
          {categories.map((cat) => (
            <div key={cat.name}>
              <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-[1.02]">
                <img
                  src={`${webUrl}/images/${cat.image_url}`}
                  alt={cat.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                 <Stack direction={'row'} justifyContent={'space-between'}>
                 <h3 className="text-lg flex items-center justify-center font-semibold text-gray-900">
                    {cat.name}
                  </h3>
                  <Tooltip title='choose from gallary'><IconButton onClick={()=>{
                  setSelectedCategory(cat)
                  setShowGallary(true)
                }}><Settings/></IconButton></Tooltip>
                 </Stack>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>}
</>

 
  );
};

export default MealCategoryForm;
