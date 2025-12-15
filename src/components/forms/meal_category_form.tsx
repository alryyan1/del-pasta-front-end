import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useCategoryStore } from "@/stores/CategoryStore";
import { Dialog, DialogTitle, DialogContent, DialogActions, Switch, FormControlLabel } from "@mui/material";
import { IconButton, Tooltip, Button } from "@mui/material";
import { Settings, Plus, Image as ImageIcon } from "lucide-react";
import CategoryGallary from "@/pages/CategoryGallary";
import { webUrl } from "@/helpers/constants";

const MealCategoryForm = () => {
  const { t } = useTranslation('addCategory'); // Hook for translation
  const [categoryName, setCategoryName] = useState("");
  const [categoryImage, setCategoryImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const { fetchCategories, categories, add, updateVisibility, updateOrder } = useCategoryStore((state) => state);
  const [showGallary, setShowGallary] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);
    const [selectedCategory, setSelectedCategory] = useState<{ id: number; name: string; image_url: string } | null>(null)
  console.log(previewImage, "Preview Image", "Name", categoryName);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
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

    add(categoryName, previewImage || "");

    setCategoryName("");
    setCategoryImage(null);
    setPreviewImage(null);
    setShowAddDialog(false);
  };

  // Handle visibility toggle
  const handleVisibilityToggle = (categoryId: number, currentVisibility: boolean) => {
    updateVisibility(categoryId, !currentVisibility);
  };

  // Handle image selection and create preview
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCategoryImage(file);

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
        <div className="p-6">
          {/* Header with Add Button */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {t("form.categories_management")}
            </h2>
            <Tooltip title={t("form.add_new_category")}>
              <IconButton
                onClick={() => setShowAddDialog(true)}
                className="bg-primary text-white hover:bg-primary-dark"
                size="large"
              >
                <Plus size={24} />
              </IconButton>
            </Tooltip>
          </div>

          {/* Categories Table */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t("form.image")}
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t("form.category_name")}
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ترتيب
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t("form.visibility")}
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t("form.actions")}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {categories.map((cat) => (
                    <tr key={cat.id || cat.name} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex justify-center">
                          {cat.image_url ? (
                            <img
                              src={`${webUrl}/images/${cat.image_url}`}
                              alt={cat.name}
                              className="w-16 h-16 object-cover rounded-lg shadow-sm"
                            />
                          ) : (
                            <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                              <ImageIcon size={24} className="text-gray-400" />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 text-right">
                          {cat.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex justify-center">
                          <input
                            type="number"
                            min="0"
                            value={cat.order_id || 0}
                            onChange={(e) => updateOrder(cat.id, parseInt(e.target.value) || 0)}
                            className="w-16 px-2 py-1 text-sm border border-gray-300 rounded text-center"
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex justify-center">
                          <FormControlLabel
                            control={
                              <Switch
                                checked={cat.is_visible !== false}
                                onChange={() => handleVisibilityToggle(cat.id, cat.is_visible ?? true)}
                                color="primary"
                              />
                            }
                            label=""
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Tooltip title={t("form.choose_from_gallery")}>
                          <IconButton 
                            onClick={() => {
                              setSelectedCategory(cat);
                              setShowGallary(true);
                            }}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <Settings size={18} />
                          </IconButton>
                        </Tooltip>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Add Category Dialog */}
          <Dialog 
            open={showAddDialog} 
            onClose={() => setShowAddDialog(false)}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle className="text-right">
              {t("form.add_meal_category")}
            </DialogTitle>
            <form onSubmit={handleSubmit}>
              <DialogContent>
                <div className="space-y-4">
                  {/* Category Name Input */}
                  <div>
                    <label
                      htmlFor="categoryName"
                      className="block text-sm font-medium text-gray-700 text-right mb-2"
                    >
                      {t("form.category_name")}
                    </label>
                    <input
                      type="text"
                      id="categoryName"
                      value={categoryName}
                      onChange={(e) => setCategoryName(e.target.value)}
                      className="w-full border border-gray-300 rounded-md shadow-sm p-2"
                      placeholder={t("form.enter_category_name")}
                      required
                    />
                  </div>

                  {/* Image Upload */}
                  <div>
                    <label
                      htmlFor="categoryImage"
                      className="block text-sm font-medium text-gray-700 text-right mb-2"
                    >
                      {t("form.category_image")}
                    </label>
                    <input
                      type="file"
                      id="categoryImage"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full text-sm text-gray-900 border border-gray-300 rounded-md cursor-pointer bg-gray-50 p-2"
                      required
                    />
                  </div>

                  {/* Image Preview */}
                  {previewImage && (
                    <div>
                      <p className="text-sm text-gray-700 text-right mb-2">
                        {t("form.image_preview")}
                      </p>
                      <img
                        src={previewImage}
                        alt={t("form.image_preview")}
                        className="w-full h-48 object-cover rounded-md"
                      />
                    </div>
                  )}
                </div>
              </DialogContent>
              <DialogActions className="justify-between px-6 py-4">
                <Button 
                  onClick={() => setShowAddDialog(false)}
                  color="secondary"
                >
                  {t("form.cancel")}
                </Button>
                <Button 
                  type="submit"
                  variant="contained"
                  color="primary"
                >
                  {t("form.add_category")}
                </Button>
              </DialogActions>
            </form>
          </Dialog>
        </div>
      )}
    </>
  );
};

export default MealCategoryForm;
