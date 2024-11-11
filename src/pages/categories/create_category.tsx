import { useState } from "react";
import {
  Form,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { XCircleIcon, PlusCircleIcon } from "@heroicons/react/24/solid";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Header from "@/components/header";

const formSchema = z.object({
  categoryName: z.string().min(2, {
    message: "يجب أن يكون اسم القسم على الأقل حرفين.",
  }),
  image: z.instanceof(File).refine((file) => file.size > 0, {
    message: "يرجى تحميل صورة.",
  }),
});

function CreateCategory() {
  const { toast } = useToast();
  const [imagePreview, setImagePreview] = useState(null);

  const form = useForm({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data) => {
    toast({
      title: "تم إنشاء قسم جديد بنجاح!",
      description: "تمت إضافة القسم الجديد.",
    });
    console.log(data);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      form.setValue("image", file); // تعيين الصورة في حالة النموذج
      setImagePreview(URL.createObjectURL(file)); // عرض معاينة الصورة
    }
  };

  return (
    <>
      <Header />
      <div
        className="flex justify-center items-center  bg-gray-50"
        dir="rtl"
      >
        <Card className="max-w-md w-full shadow-lg">
          <CardHeader className="bg-primary text-white p-4">
            <h1 className="text-xl font-semibold">إنشاء قسم جديد</h1>
          </CardHeader>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6 p-4">
              <Form {...form}>
                <FormItem>
                  <FormLabel>اسم القسم</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="أدخل اسم القسم"
                      {...form.register("categoryName")}
                    />
                  </FormControl>
                  {form.formState.errors.categoryName && (
                    <FormMessage>
                      {form.formState.errors.categoryName.message}
                    </FormMessage>
                  )}
                </FormItem>

                <FormItem>
                  <FormLabel>صورة</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </FormControl>
                  {form.formState.errors.image && (
                    <FormMessage>
                      {form.formState.errors.image.message}
                    </FormMessage>
                  )}
                  {imagePreview && (
                    <div className="relative mt-4 rounded-lg overflow-hidden shadow-md">
                      <img
                        src={imagePreview}
                        alt="الصورة المختارة"
                        className="w-full h-32 object-cover"
                      />
                      <Button
                        variant="link"
                        onClick={() => {
                          setImagePreview(null);
                          form.setValue("image", undefined); // إزالة الصورة من حالة النموذج
                        }}
                        className="absolute top-2 left-2 p-1 bg-white rounded-full shadow"
                      >
                        <XCircleIcon className="w-6 h-6 text-red-500" />
                      </Button>
                    </div>
                  )}
                </FormItem>
              </Form>
            </CardContent>
            <CardFooter className="p-4">
              <Button
                type="submit"
                style={{ borderRadius: "10px" }}
                className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-orange-500 text-white"
              >
                <PlusCircleIcon className="w-5 h-5" />
                إنشاء القسم
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </>
  );
}

export default CreateCategory;
