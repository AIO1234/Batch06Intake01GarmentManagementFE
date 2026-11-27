<!--------------------------------------------->
<!------------Section two---------------------->
<!--------------------------------------------->
<!--------------------------------------------->



<template>
  <section>
    <!-------filter bar -->
    <v-card variant="outlined" class="pa-4 mb-5 bg-gray rounded-lg">
      <v-row align="end" justify="space-between" dense>
        <v-col cols="12" sm="4" md="3"> 
          <lable class="text-caption font-weight-bold text-grey-darken-2 d-block mb-1">
            Material
          </lable>
          <v-select
          v-model="selectedFilterMaterial"
            :items="filterOptions"
            item-title="label"
            item-value="value"
            variant="outlined"
            density="compact"
            hide-details
          />
        </v-col>
      </v-row>
    </v-card>
  </section>
</template>