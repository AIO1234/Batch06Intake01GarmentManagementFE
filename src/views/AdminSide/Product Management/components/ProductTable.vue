
<template>
  <div>
    <v-container>
      <div class="mt-10"></div>

      <v-card class="pa-5" elevation="3">
        <v-data-table
          :items="items"
          :headers="headers"
          :loading="loading"
        >
          <template
            v-for="header in headers"
            :key="header.value"
            v-slot:[`item.${header.value}`]="props"
          >
            <!-- Product Name -->
            <div v-if="header.value === 'productName'">
              {{ props.item.productName }}
            </div>

            <!-- Product Code -->
            <div v-if="header.value === 'productCode'">
              {{ props.item.productCode }}
            </div>

            <!-- Category -->
            <div v-if="header.value === 'category'">
              {{ props.item.category }}
            </div>

            <!-- Price -->
            <div v-if="header.value === 'price'">
              Rs. {{ props.item.price }}
            </div>

            <!-- Quantity -->
            <div v-if="header.value === 'quantity'">
              {{ props.item.quantity }}
            </div>

            <!-- Status -->
            <div v-if="header.value === 'status'">
              <v-chip
                :color="props.item.status === 'Active' ? 'success' : 'error'"
                size="small"
              >
                {{ props.item.status }}
              </v-chip>
            </div>

            <!-- Actions -->
            <v-row
              v-if="header.value === 'action'"
              align="center"
              no-gutters
            >
              <v-col cols="auto">
                <v-btn
                  style="text-transform: capitalize"
                  color="success"
                  size="small"
                  @click="openEditForm(props.item)"
                >
                  Edit
                </v-btn>
              </v-col>

              <v-col cols="auto" class="ml-2">
                <v-btn
                  style="text-transform: capitalize"
                  color="red"
                  size="small"
                  @click="deleteProduct(props.item.id)"
                >
                  Delete
                </v-btn>
              </v-col>
            </v-row>

          </template>
        </v-data-table>
      </v-card>
    </v-container>

    <!-- Update Product Dialog -->
    <v-dialog
      v-model="showEditForm"
      max-width="500px"
      persistent
    >
      <v-card class="form">

        <v-card-title
          class="d-flex justify-space-between align-center"
        >
          <span class="header">Edit Product</span>

          <v-btn
            icon
            @click="closeEditForm"
            class="icon_btn"
          >
            <v-icon color="primary">mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text>
          <UpdateProduct
            :selectedItem="selectedItem"
            @closeModal="closeEditForm"
          />
        </v-card-text>

      </v-card>
    </v-dialog>

  </div>
</template>

<script>


export default {
  components: {
  },

  data() {
    return {
      items: [],

      loading: false,

      showEditForm: false,

      selectedItem: {},

      headers: [
        { title: "Product Name", value: "productName" },
        { title: "Product Code", value: "productCode" },
        { title: "Category", value: "category" },
        { title: "Price", value: "price" },
        { title: "Quantity", value: "quantity" },
        { title: "Status", value: "status" },
        { title: "Action", value: "action", sortable: false },
      ],
    };
  },

  created() {
    this.getProducts();
  },

  methods: {

    // Get Products
    getProducts() {
      this.loading = true;

      this.items = [
        {
          id: 1,
          productName: "Polo Shirt",
          productCode: "PRD001",
          category: "Clothing",
          price: 2500,
          quantity: 100,
          status: "Active",
        },
        {
          id: 2,
          productName: "Denim Trouser",
          productCode: "PRD002",
          category: "Clothing",
          price: 3500,
          quantity: 50,
          status: "Active",
        },
        {
          id: 3,
          productName: "Cotton Fabric",
          productCode: "PRD003",
          category: "Materials",
          price: 1200,
          quantity: 0,
          status: "Inactive",
        },
      ];

      this.loading = false;
    },

    // Open Edit Form
    openEditForm(item) {
      this.selectedItem = { ...item };
      this.showEditForm = true;
    },

    // Close Edit Form
    closeEditForm() {
      this.showEditForm = false;
      this.selectedItem = {};
    },

    // Delete Product
    deleteProduct(id) {
      this.items = this.items.filter(
        (item) => item.id !== id
      );
    },

  },
};
</script>
