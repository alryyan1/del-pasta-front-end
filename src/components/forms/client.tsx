import { Paper, TextField, Typography } from '@mui/material'
import React from 'react'
import { useForm } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';

function AddClientForm({setLoading,loading}) {
    
    const {
        register,
        reset,
        formState: { errors, isSubmitted },
        handleSubmit,
      } = useForm();
      const submitHandler = async (formData) => {
        setLoading(true);
        try {
          const { data } = await axiosClient.post(
            "client/create",
           formData
          );
          console.log(data, "created")
          if (data.status) {
            reset();
          
            setLoading(false);
          }
        } catch ({ response:{data} }) {
          
        
            setLoading(false);

        }
        setLoading(false);

      };
  return (
    <Paper sx={{p:1}}>
        
    <Typography textAlign={'center'} variant="h5">اضافه عميل </Typography>
    <form noValidate onSubmit={handleSubmit(submitHandler)}>
      <div>
        <TextField
         fullWidth
          error={errors.name != null}
          {...register("name", {
            required: { value: true, message: "يجب ادخال اسم العميل" },
          })}
          id="outlined-basic"
          label="اسم العميل"
          variant="filled"
          helperText ={errors.name && errors.name.message}
        />
        
      </div>
      <div>
        <TextField
          fullWidth
          error={errors.phone != null}
          {...register("phone", {
            required: { value: true, message: "يجب ادخال رقم الهاتف" },
          })}
          id="outlined-basic"
          label="رقم الهاتف"
          variant="filled"
          type="number"
          
          helperText ={errors.phone && errors.phone.message}
        />
      </div>
      <div>
        <TextField
          fullWidth
          error={errors.address != null}
          {...register("address", {
            required: { value: true, message: "يجب ادخال العنوان" },
          })}
          id="outlined-basic"
          label="العنوان"
          variant="filled"
          helperText ={errors.address && errors.address.message}
        />
      </div>
      <div>
        <TextField
          sx={{ mb: 1 }}
          fullWidth
          {...register("email")}
          id="outlined-basic"
          label="الايميل"
          variant="filled"
          helperText ={errors.email && errors.email.message}
        />
      </div>
      <div></div>
      <LoadingButton
        fullWidth
        loading={loading}
        variant="contained"
        type="submit"
      >
        حفظ
      </LoadingButton>
    </form>
    </Paper>
  )
}

export default AddClientForm