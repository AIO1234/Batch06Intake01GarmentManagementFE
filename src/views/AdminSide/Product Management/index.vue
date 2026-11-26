
<template>
  <div>
    <ProductTable />
    <AddProduct />
    <UpdateProduct />
    <ProductDetails />
  </div>
</template>

<script>
import ProductTable from './components/ProductTable.vue'
import AddProduct from './components/AddProduct.vue'
import UpdateProduct from './components/UpdateProduct.vue'
import ProductDetails from './components/ProductDetails.vue'

export default {
  name: 'ProductManagement',

  components: {
    ProductTable,
    AddProduct,
    UpdateProduct,
    ProductDetails
  }
}
</script>
