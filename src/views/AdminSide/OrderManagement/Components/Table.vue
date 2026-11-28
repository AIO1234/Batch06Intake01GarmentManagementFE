<template> 

<div> 

<v-card class="pa-4" elevation="2"> 

<v-row class="mb-3 align-center" dense> 

<v-col cols="12" md="6"> 

<v-text-field 

v-model="searchQuery" 

prepend-inner-icon="mdi-magnify" 

placeholder="Search order no. / customer..." 

variant="outlined" 

density="compact" 

hide-details 

clearable 

/> 

</v-col> 

<v-col cols="12" md="6" class="text-md-right"> 

<v-btn 

class="erp_primary_btn" 

prepend-icon="mdi-plus" 

@click="$emit('openCreateForm')" 

> 

New Order 

</v-btn> 

</v-col> 

</v-row> 

 

<v-data-table 

class="erp_table" 

:items="filteredOrders" 

:headers="headers" 

:loading="loading" 

:items-per-page="10" 

hover 

> 

<template #[`item.unit_price`]="{ item }"> 

{{ formatCurrency(item.unit_price) }} 

</template> 

 

<template #[`item.status`]="{ item }"> 

<span class="status_badge" :style="badgeStyle(item.status)"> 

{{ item.status }} 

</span> 

</template> 

 

<template #[`item.action`]="{ item }"> 

<div class="d-flex ga-2"> 

<v-btn 

size="small" 

color="primary" 

variant="tonal" 

style="text-transform: capitalize" 

@click="openEditForm(item)" 

> 

Edit 

</v-btn> 

<v-btn 

size="small" 

color="error" 

variant="tonal" 

style="text-transform: capitalize" 

@click="deleteOrder(item)" 

> 

Delete 

</v-btn> 

</div> 

</template> 

</v-data-table> 

</v-card> 

 

<v-dialog v-model="showEditForm" max-width="680px" persistent> 

<v-card class="pa-2"> 

<v-card-title class="d-flex justify-space-between align-center"> 

<span class="font-weight-bold">Edit Order</span> 

<v-btn icon variant="text" @click="closeEditForm(false)"> 

<v-icon color="primary">mdi-close</v-icon> 

</v-btn> 

</v-card-title> 

<v-card-text> 

<UpdateOrder 

:selected-item="selectedItem" 

:customers="customers" 

:styles="styles" 

@closeModal="closeEditForm" 

/> 

</v-card-text> 

</v-card> 

</v-dialog> 

</div> 

</template> 

 

<script> 

import Swal from "sweetalert2"; 

import UpdateOrder from "@/views/AdminSide/OrderManagement/Components/UpdateOrder.vue"; 

import orderService, { getStatusColor } from "@/services/orderService"; 

 

export default { 

name: "OrderTable", 

components: { 

UpdateOrder, 

}, 

 

props: { 

orders: { 

type: Array, 

default: () => [], 

}, 

customers: { 

type: Array, 

default: () => [], 

}, 

styles: { 

type: Array, 

default: () => [], 

}, 

loading: { 

type: Boolean, 

default: false, 

}, 

}, 

 

emits: ["openCreateForm", "refreshOrders"], 

 

data() { 

return { 

searchQuery: "", 

showEditForm: false, 

selectedItem: {}, 

headers: [ 

{ title: "Order No.", key: "order_no" }, 

{ title: "Date", key: "order_date" }, 

{ title: "Customer", key: "customer_name" }, 

{ title: "Style", key: "style_label" }, 

{ title: "Qty", key: "quantity", align: "end" }, 

{ title: "Unit Price", key: "unit_price", align: "end" }, 

{ title: "Delivery", key: "delivery_date" }, 

{ title: "Status", key: "status" }, 

{ title: "Action", key: "action", sortable: false }, 

], 

}; 

}, 

 

computed: { 

filteredOrders() { 

const q = (this.searchQuery || "").trim().toLowerCase(); 

if (!q) return this.orders; 

return this.orders.filter((item) => { 

return ( 

String(item.order_no || "").toLowerCase().includes(q) || 

String(item.customer_name || "").toLowerCase().includes(q) || 

String(item.style_label || "").toLowerCase().includes(q) || 

String(item.status || "").toLowerCase().includes(q) 

); 

}); 

}, 

}, 

 

methods: { 

formatCurrency(value) { 

const num = Number(value || 0); 

return num.toLocaleString("en-US", { 

minimumFractionDigits: 2, 

maximumFractionDigits: 2, 

}); 

}, 

 

badgeStyle(status) { 

const color = getStatusColor(status); 

return { 

backgroundColor: color.bg, 

color: color.text, 

}; 

}, 

 

openEditForm(item) { 

this.selectedItem = { ...item }; 

this.showEditForm = true; 

}, 

 

closeEditForm(shouldRefresh = false) { 

this.showEditForm = false; 

if (shouldRefresh) { 

this.$emit("refreshOrders"); 

} 

}, 

 

async deleteOrder(item) { 

const result = await Swal.fire({ 

icon: "warning", 

title: "Delete Order?", 

text: `Are you sure you want to delete ${item.order_no}?`, 

showCancelButton: true, 

confirmButtonColor: "#d33", 

confirmButtonText: "Yes, delete", 

}); 

 

if (result.isConfirmed) { 

await orderService.deleteOrder(item.id); 

this.$emit("refreshOrders"); 

Swal.fire({ 

icon: "success", 

title: "Deleted", 

text: `Order ${item.order_no} removed.`, 

timer: 1500, 

showConfirmButton: false, 

}); 

} 

}, 

}, 

}; 

</script> 

 

 