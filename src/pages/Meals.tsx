import ProductForm from '@/components/forms/meal'
import { Grid } from '@mui/material'
import React from 'react'

function Meals() {
  return (
    <Grid container>Meals

        <Grid item xs='3'>

        <ProductForm />
        </Grid>
    </Grid>
  )
}

export default Meals