import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormItem,
  FormControl,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { PlusCircleIcon } from "@heroicons/react/24/solid";
import Header from "@/components/header";

// Updated form schema with image validation
const formSchema = z.object({
  name: z.string().min(2, { message: "اسم الصنف يجب أن يكون على الأقل حرفين" }),
  price: z
    .string()
    .transform((val) => parseFloat(val)) // Convert string to number
    .refine((val) => !isNaN(val) && val > 0, {
      message: "السعر يجب أن يكون رقماً موجباً",
    }),
  description: z.string().min(5, { message: "يرجى إضافة وصف مناسب" }),
  image: z
    .instanceof(File)
    .refine((file) => file && file.type.startsWith("image/"), {
      message: "يرجى اختيار صورة صالحة",
    }),
  available: z.boolean().default(true),
  calories: z
    .string()
    .optional()
    .transform((val) => (val ? parseFloat(val) : undefined))
    .refine((val) => !val || !isNaN(val), {
      message: "السعرات يجب أن تكون رقماً",
    }),
  prepTime: z
    .string()
    .optional()
    .transform((val) => (val ? parseFloat(val) : undefined))
    .refine((val) => !val || !isNaN(val), {
      message: "مدة التحضير يجب أن تكون رقماً",
    }),
  spiceLevel: z
    .string()
    .optional()
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val) && val >= 1 && val <= 5, {
      message: "مستوى التوابل يجب أن يكون بين 1 و 5",
    }),
  isVegan: z.boolean(),
  isGlutenFree: z.boolean(),
});

function CreateMeal() {
  const { toast } = useToast();
  const [imagePreview, setImagePreview] = useState(null);

  const methods = useForm({
    resolver: zodResolver(formSchema),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = methods;

  const onSubmit = (data) => {
    toast({ title: "تم إضافة الصنف بنجاح!" });
    console.log(data);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setValue("image", file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <>
      <Header />
      <div
        className="flex justify-center items-center  bg-gray-50"
        dir="rtl"
      >
        <Card className="max-w-lg w-full shadow-lg">
          <CardHeader className="bg-primary text-white p-4 rounded-t-lg">
            <h1 className="text-xl font-semibold">إضافة صنف جديد</h1>
          </CardHeader>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4">
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Name */}
                  <FormItem>
                    <FormLabel>اسم الصنف</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        {...register("name")}
                        placeholder="أدخل اسم الصنف"
                        className={`border-gray-300 rounded-md focus:border-blue-500 focus:ring focus:ring-blue-200 ${
                          errors.name ? "border-red-500" : ""
                        }`}
                      />
                    </FormControl>
                    {errors.name && (
                      <FormMessage>{errors.name.message}</FormMessage>
                    )}
                  </FormItem>

                  {/* Price */}
                  <FormItem>
                    <FormLabel>السعر</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...register("price")}
                        placeholder="أدخل السعر"
                        className={`border-gray-300 rounded-md focus:border-blue-500 focus:ring focus:ring-blue-200 ${
                          errors.price ? "border-red-500" : ""
                        }`}
                      />
                    </FormControl>
                    {errors.price && (
                      <FormMessage>{errors.price.message}</FormMessage>
                    )}
                  </FormItem>
                </div>

                {/* Description */}
                <FormItem>
                  <FormLabel>الوصف</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      {...register("description")}
                      placeholder="أدخل الوصف"
                      className={`border-gray-300 rounded-md focus:border-blue-500 focus:ring focus:ring-blue-200 ${
                        errors.description ? "border-red-500" : ""
                      }`}
                    />
                  </FormControl>
                  {errors.description && (
                    <FormMessage>{errors.description.message}</FormMessage>
                  )}
                </FormItem>

                {/* Image */}
                <FormItem>
                  <FormLabel>الصورة</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className={`border-gray-300 rounded-md ${
                        errors.image ? "border-red-500" : ""
                      }`}
                    />
                  </FormControl>
                  {errors.image && (
                    <FormMessage>{errors.image.message}</FormMessage>
                  )}
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Selected"
                      className="w-full h-32 object-cover mt-4 rounded-md shadow-md"
                    />
                  )}
                </FormItem>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Calories */}
                  <FormItem>
                    <FormLabel>السعرات الحرارية</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...register("calories")}
                        placeholder="أدخل السعرات"
                        className={`border-gray-300 rounded-md focus:border-blue-500 focus:ring focus:ring-blue-200`}
                      />
                    </FormControl>
                  </FormItem>

                  {/* Prep Time */}
                  <FormItem>
                    <FormLabel>مدة التحضير (دقائق)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...register("prepTime")}
                        placeholder="أدخل مدة التحضير"
                        className={`border-gray-300 rounded-md focus:border-blue-500 focus:ring focus:ring-blue-200`}
                      />
                    </FormControl>
                  </FormItem>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Spice Level */}
                  <FormItem>
                    <FormLabel>مستوى التوابل (1-5)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...register("spiceLevel")}
                        placeholder="اختر مستوى التوابل"
                        min={1}
                        max={5}
                        className={`border-gray-300 rounded-md focus:border-blue-500 focus:ring focus:ring-blue-200`}
                      />
                    </FormControl>
                    {/* Availability */}
                    <FormItem className="flex items-center">
                      <FormLabel>متاح</FormLabel>
                      <FormControl>
                        <input
                          type="checkbox"
                          {...register("available")}
                          className="ml-2 mr-4 transform scale-125"
                          defaultChecked
                        />
                      </FormControl>
                    </FormItem>
                  </FormItem>

                  {/* Vegan and Gluten-Free */}
                  <FormItem className="flex items-center space-x-4">
                    <label className="mr-2">نباتي</label>
                    <input
                      type="checkbox"
                      {...register("isVegan")}
                      className="ml-2"
                    />
                  </FormItem>
                  <FormItem className="flex items-center space-x-4">
                    <label className="mr-2">خالٍ من الغلوتين</label>
                    <input
                      type="checkbox"
                      {...register("isGlutenFree")}
                      className="ml-2"
                    />
                  </FormItem>
                </div>
              </CardContent>

              {/* Submit Button */}
              <CardFooter className="p-4">
                <Button
                  type="submit"
                  style={{ borderRadius: "10px" }}
                  className="w-full bg-primary hover:bg-orange-500 text-white flex items-center justify-center gap-2 rounded-md"
                >
                  <PlusCircleIcon className="w-5 h-5" />
                  إضافة الصنف
                </Button>
              </CardFooter>
            </form>
          </FormProvider>
        </Card>
      </div>
    </>
  );
}

export default CreateMeal;
