<template>
    <div>
        <v-container fluid class="pa-6 bggrey-lighten-5">
            <!------------------------>
            <!---------Section first -->
            <!------------------------>

            <section class="mb-10">
                <!------------Search bar--------->
                <v-text-field
                v-model="searchQuery"
                placeholder="material search"
                prepend-inner-icon="midi-magnify"
                variant="outlined"
                density="comfortable"
                bg-color="white"
                hide-details
                class="mb-4"
                />

                <!------------Stock Summary Table--------->
                <v-card variant="outlined" class="mb-6 bg-white rounded-lg"></v-card>
            <v-data-table
                :headers="stockHeaders"
                :items="filteredStockItems"
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
          <strong>Available: {{ formatNumber(selectedMaterialObj?.available ?? 0) }} {{ selectedMaterialObj?.unit || '' }}</strong>
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

            <v-col cols="12" md="4" class="d-flex justify-start md:justify-start">
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

      <v-card variant="outlined" class="bg-white rounded-lg">
        <v-data-table
          v-model:page="page"
          :headers="balanceHeaders"
          :items="appliedBalanceRows"
          :items-per-page="itemsPerPage"
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

        <!-- Custom Footer matching "Showing 1–3 of 3" & pagination -->
        <div class="d-flex align-center justify-space-between px-4 py-3 text-caption text-grey-darken-1">
          <div>
            Showing {{ startItem }}–{{ endItem }} of {{ appliedBalanceRows.length }}
          </div>

          <div class="d-flex align-center ga-3">
            <button
              class="pager-btn"
              :disabled="page <= 1"
              @click="page--"
            >
              &lsaquo; Prev
            </button>

            <button
              v-for="p in totalPages"
              :key="p"
              class="pager-num"
              :class="{ active: p === page }"
              @click="page = p"
            >
              {{ p }}
            </button>

            <button
              class="pager-btn"
              :disabled="page >= totalPages"
              @click="page++"
            >
              Next &rsaquo;
            </button>
          </div>
        </div>
      </v-card>





            </section>

        </v-container>
        
        
    </div>
</template>
<script>
import { ref, computed } from 'vue'

// --- Sample Data ---
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

// --- Section 1 State ---
const searchQuery = ref('')
const issueFormRef = ref(null)

const form = ref({
  materialId: 1,
  order: 'ORD-2026-0001',
  issueDate: '2026-10-26',
  quantity: 120,
})

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

const qtyRule = (val) => {
  const max = selectedMaterialObj.value?.available ?? 0
  if (!val || val <= 0) return 'Quantity must be greater than 0'
  if (val > max) return `Cannot exceed available stock (${max})`
  return true
}

function syncAvailable() {
  form.value.quantity = 0
}

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
</script>
