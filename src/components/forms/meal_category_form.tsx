import React, { useState } from "react";
import Header from "../header";
import Card from "../Card";
import axiosClient from "@/helpers/axios-client";

const MealCategoryForm = () => {
  const [categoryName, setCategoryName] = useState("");
  const [categoryImage, setCategoryImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  console.log(previewImage,'prevew img','name ',categoryName)

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form data
    if (!categoryName || !categoryImage) {
      alert("الرجاء إدخال جميع البيانات");
      return;
    }

    // Simulate form data submission
    const formData = new FormData();
    formData.append("categoryName", categoryName);
    formData.append("categoryImage", categoryImage);


    console.log("اسم التصنيف:", categoryName);
    console.log("تم رفع الصورة:", categoryImage);

    axiosClient.post('categories',{
      name:categoryName,
      image:previewImage
    }).then(({data})=>{
      console.log(data,'data')
    })

    // Clear form after submission
    setCategoryName("");
    setCategoryImage(null);
    setPreviewImage(null);

  };

  // Handle file input change and preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCategoryImage(file);

      // Generate preview of the selected image
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  
  return (
    <>
      <div dir="rtl" className="max-w-md mx-auto mt-10 p-4 bg-white shadow-md rounded-lg">
        <h2 style={{ textAlign: "right" }} className="text-2xl font-bold mb-4">إضافة صنف وجبة</h2>
        <form onSubmit={handleSubmit}>
          {/* Category Name Input */}
          <div className="mb-4">
            <label
              htmlFor="categoryName"
              style={{ textAlign: "right", display: "block" }}
              className="block text-sm font-medium text-gray-700"
            >
              اسم التصنيف
            </label>
            <input
              type="text"
              id="categoryName"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              placeholder="أدخل اسم التصنيف"
              required
            />
          </div>

          {/* Image Upload */}
          <div className="mb-4">
            <label
              htmlFor="categoryImage"
              style={{ textAlign: "right", display: "block" }}
              className="block text-sm font-medium text-gray-700"
            >
              صورة الصنف
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
              <p style={{ textAlign: "right" }} className="text-sm text-gray-700">معاينة الصورة:</p>
              <img
                src={previewImage}
                alt="معاينة الصورة"
                className="w-full h-48 object-cover rounded-md mt-2"
              />
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-primary text-white p-2 rounded-md shadow hover:bg-primary-dark"
          >
            إضافة الصنف
          </button>
        </form>
      </div>
    </>
  );
};

export default MealCategoryForm;