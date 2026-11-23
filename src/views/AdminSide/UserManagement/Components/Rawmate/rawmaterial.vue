<template>
  <v-container fluid class="pa-6 bg-grey-lighten-5">
    <!-- Search Bar -->
    <v-text-field
      v-model="searchQuery"
      placeholder="Search material..."
      prepend-inner-icon="mdi-magnify"
      variant="outlined"
      density="comfortable"
      bg-color="white"
      hide-details
      class="mb-4"
    />

    <!-- Stock Summary Table -->
    <v-card variant="outlined" class="mb-6 bg-white rounded-lg">
      <v-data-table
        :headers="stockHeaders"
        :items="filteredStock"
        :search="searchQuery"
        hide-default-footer
        class="dark-header-table"
      >
        <template #item.receipts="{ item }">
          {{ formatNumber(item.receipts) }}
        </template>
        <template #item.issues="{ item }">
          {{ formatNumber(item.issues) }}
        </template>
        <template #item.available="{ item }">
          {{ formatNumber(item.available) }}
        </template>
      </v-data-table>
    </v-card>

    <!-- Issue Material to Production Card -->
    <v-card variant="outlined" class="pa-5 mb-6 bg-white rounded-lg">
      <div class="text-subtitle-1 font-weight-bold mb-3">
        Issue material to production
      </div>
      <v-divider class="border-dashed mb-4" />

      <v-alert
        type="info"
        variant="tonal"
        color="blue-darken-2"
        class="mb-4 text-body-2"
      >
        <strong>
          Available: {{ formatNumber(selectedMaterialObj?.available ?? 0) }}
          {{ selectedMaterialObj?.unit || '' }}
        </strong>
        · issue cannot exceed available stock.
      </v-alert>

      <v-form ref="issueFormRef" @submit.prevent="handleIssueStock">
        <v-row dense class="mb-2">
          <v-col cols="12" md="4">
            <label class="text-caption font-weight-medium d-block mb-1">
              Material<span class="text-error">*</span>
            </label>
            <v-select
              v-model="form.materialId"
              :items="materials"
              item-title="name"
              item-value="id"
              variant="outlined"
              density="compact"
              hide-details="auto"
              @update:model-value="syncAvailable"
            />
          </v-col>

          <v-col cols="12" md="4">
            <label class="text-caption font-weight-medium d-block mb-1">
              Order<span class="text-error">*</span>
            </label>
            <v-select
              v-model="form.order"
              :items="orders"
              variant="outlined"
              density="compact"
              hide-details="auto"
            />
          </v-col>

          <v-col cols="12" md="4">
            <label class="text-caption font-weight-medium d-block mb-1">
              Issue Date
            </label>
            <v-text-field
              v-model="form.issueDate"
              type="date"
              variant="outlined"
              density="compact"
              hide-details="auto"
            />
          </v-col>
        </v-row>

        <v-row dense align="end">
          <v-col cols="12" md="4">
            <label class="text-caption font-weight-medium d-block mb-1">
              Available
            </label>
            <v-text-field
              :model-value="formatNumber(selectedMaterialObj?.available ?? 0)"
              variant="outlined"
              density="compact"
              bg-color="grey-lighten-4"
              readonly
              hide-details
            />
          </v-col>

          <v-col cols="12" md="4">
            <label class="text-caption font-weight-medium d-block mb-1">
              Issue Quantity<span class="text-error">*</span>
            </label>
            <v-text-field
              v-model.number="form.quantity"
              type="number"
              step="0.01"
              min="0.01"
              :rules="[qtyRule]"
              variant="outlined"
              density="compact"
              hide-details="auto"
            />
          </v-col>

          <v-col cols="12" md="4" class="d-flex justify-start">
            <v-btn
              type="submit"
              color="#0b6b7a"
              theme="dark"
              class="text-none font-weight-semibold px-5"
              height="40"
            >
              Issue Stock
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-card>

    <!-- Stock Movements (log) -->
    <v-card variant="outlined" class="pa-4 bg-white rounded-lg">
      <div class="text-subtitle-1 font-weight-bold mb-3">
        Stock movements (log)
      </div>

      <v-data-table
        :headers="logHeaders"
        :items="movements"
        hide-default-footer
        density="comfortable"
        class="dark-header-table"
      >
        <template #item.type="{ item }">
          <v-chip
            size="x-small"
            variant="flat"
            class="font-weight-bold"
            :color="item.type === 'IN' ? 'green-lighten-5' : 'red-lighten-5'"
            :class="item.type === 'IN' ? 'text-green-darken-3' : 'text-red-darken-3'"
          >
            {{ item.type }}
          </v-chip>
        </template>

        <template #item.qty="{ item }">
          <span class="font-weight-medium">
            {{
              item.qty > 0
                ? `+${formatNumber(item.qty)}`
                : `−${formatNumber(Math.abs(item.qty))}`
            }}
          </span>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue'

// Initial data for Section 1
const materials = ref([
  { id: 1, name: 'Cotton Fabric', unit: 'm', receipts: 150, issues: 120, available: 30 },
  { id: 2, name: 'Buttons', unit: 'pcs', receipts: 300, issues: 300, available: 0 },
  { id: 3, name: 'Thread', unit: 'cone', receipts: 40, issues: 5, available: 35 },
])

const orders = ref(['ORD-2026-0001', 'ORD-2026-0002', 'ORD-2026-0003'])

const movements = ref([
  { date: '2026-10-12', type: 'IN', reference: 'GRN-2026-0001', qty: 150 },
  { date: '2026-10-26', type: 'OUT', reference: 'ORD-2026-0001', qty: -120 },
])

// Search & form state
const searchQuery = ref('')
const issueFormRef = ref(null)

const form = ref({
  materialId: 1,
  order: 'ORD-2026-0001',
  issueDate: '2026-10-26',
  quantity: 120,
})

// Table headers
const stockHeaders = [
  { title: 'Material', key: 'label', align: 'start' },
  { title: 'Receipts', key: 'receipts', align: 'end' },
  { title: 'Issues', key: 'issues', align: 'end' },
  { title: 'Available', key: 'available', align: 'end' },
]

const logHeaders = [
  { title: 'Date', key: 'date', align: 'start' },
  { title: 'Type', key: 'type', align: 'start' },
  { title: 'Reference', key: 'reference', align: 'start' },
  { title: 'Qty', key: 'qty', align: 'end' },
]

// Computed values
const formattedStockRows = computed(() =>
  materials.value.map((m) => ({
    ...m,
    label: `${m.name} (${m.unit})`,
  }))
)

const filteredStock = computed(() => formattedStockRows.value)

const selectedMaterialObj = computed(() =>
  materials.value.find((m) => m.id === form.value.materialId)
)

// Validation rule for issue quantity
const qtyRule = (val) => {
  const max = selectedMaterialObj.value?.available ?? 0
  if (!val || val <= 0) return 'Quantity must be greater than 0'
  if (val > max) return `Cannot exceed available stock (${max})`
  return true
}

// Reset quantity when selected material changes
function syncAvailable() {
  form.value.quantity = 0
}

// Submit stock issue form and update movement log
async function handleIssueStock() {
  const { valid } = await issueFormRef.value.validate()
  if (!valid || !selectedMaterialObj.value) return

  const qty = Number(form.value.quantity)
  selectedMaterialObj.value.issues += qty
  selectedMaterialObj.value.available -= qty

  movements.value.unshift({
    date: form.value.issueDate,
    type: 'OUT',
    reference: form.value.order,
    qty: -qty,
  })

  form.value.quantity = 0
}

function formatNumber(num) {
  return Number.isInteger(num) ? String(num) : Number(num).toFixed(2)
}
</script>

