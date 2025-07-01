// src/components/admin/UserFormDialog.tsx
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Extend the base User type with additional properties for the form
interface UserFormData {
  id?: number;
  name: string;
  username: string;
  user_type: 'admin' | 'staff';
}

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from 'lucide-react';

// Base schema without refine for extending
const baseUserSchema = z.object({
  name: z.string().min(2, { message: "Name is required." }),
  username: z.string().min(4, { message: "Username must be at least 4 characters." }),
  user_type: z.enum(['admin', 'staff']),
  password: z.string().min(4, { message: "Password must be at least 4 characters." }),
  password_confirmation: z.string(),
});

// Schema for creating users with password validation
const userSchema = baseUserSchema.refine((data: typeof baseUserSchema._type) => data.password === data.password_confirmation, {
    message: "Passwords do not match.",
    path: ["password_confirmation"],
});

// Schema for editing users where password is optional
const userEditSchema = baseUserSchema.extend({
    password: z.string().optional(),
    password_confirmation: z.string().optional(),
}).refine((data: { password?: string; password_confirmation?: string }) => data.password === data.password_confirmation, {
    message: "Passwords do not match.",
    path: ["password_confirmation"],
});

type UserFormValues = z.infer<typeof userSchema>;

interface UserFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: Partial<UserFormValues>, userId?: number) => void;
  initialData?: UserFormData | null;
  isLoading: boolean;
}

export const UserFormDialog: React.FC<UserFormDialogProps> = ({ open, onOpenChange, onSave, initialData, isLoading }) => {
  const form = useForm<UserFormValues>({
    resolver: zodResolver(initialData ? userEditSchema : userSchema),
  });

  React.useEffect(() => {
    if (initialData) {
      form.reset({
        name: initialData.name,
        username: initialData.username,
        user_type: initialData.user_type,
        password: '', // Always clear password on edit
        password_confirmation: '',
      });
    } else {
      form.reset({ name: '', username: '', user_type: 'staff', password: '', password_confirmation: '' });
    }
  }, [initialData, open]);

  const handleSubmit = (data: UserFormValues) => {
    // If password field is empty on edit, don't send it.
    if(initialData && !data.password) {
        delete (data as Partial<UserFormValues>).password;
        delete (data as Partial<UserFormValues>).password_confirmation;
    }
    onSave(data, initialData?.id);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit User' : 'Create New User'}</DialogTitle>
          <DialogDescription>
            {initialData ? 'Update the user details.' : 'Add a new user and assign a role.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...form.register('name')} />
            {form.formState.errors.name && <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input id="username" {...form.register('username')} />
            {form.formState.errors.username && <p className="text-sm text-red-500">{form.formState.errors.username.message}</p>}
          </div>
          <div className="space-y-2">
            <Label>Role</Label>
             <Controller name="user_type" control={form.control} render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange} defaultValue="staff">
                    <SelectTrigger><SelectValue placeholder="Select a role" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="staff">Staff</SelectItem>
                    </SelectContent>
                </Select>
             )} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">{initialData ? 'New Password (Optional)' : 'Password'}</Label>
            <Input id="password" type="password" {...form.register('password')} />
            {form.formState.errors.password && <p className="text-sm text-red-500">{form.formState.errors.password.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password_confirmation">Confirm Password</Label>
            <Input id="password_confirmation" type="password" {...form.register('password_confirmation')} />
            {form.formState.errors.password_confirmation && <p className="text-sm text-red-500">{form.formState.errors.password_confirmation.message}</p>}
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save User
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};