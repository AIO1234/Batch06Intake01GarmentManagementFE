<template>
  <div>
    <ProductTable />

    <AddProduct />

    <UpdateProduct />

    <ProductDetails />
  </div>
</template>

<script>
import ProductTable from './views/AdminSide/Product Management/components/ProductTable.vue'
import AddProduct from './views/AdminSide/Product Management/components/AddProduct.vue'
import UpdateProduct from './views/AdminSide/Product Management/components/UpdateProduct.vue'
import ProductDetails from './views/AdminSide/Product Management/components/ProductDetails.vue'

export default {
  components: {
    ProductTable,
    AddProduct,
    UpdateProduct,
    ProductDetails
  }
}
</script>