<template>
  <div class="eshop-page">
    <!-- Hero Banner Section -->
    <v-parallax
      src="https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=2532&auto=format&fit=crop"
      height="300"
      class="mb-8"
    >
      <div class="d-flex flex-column fill-height justify-center align-center text-white bg-black-overlay">
        <h1 class="text-h2 font-weight-bold mb-4 text-center">Profesionální E-shop</h1>
        <p class="text-h5 text-center mb-6" style="max-width: 700px;">
          Špičkové nářadí, instalační materiál a ochranné pomůcky pro vaše projekty.
        </p>
        <v-btn size="large" color="primary" elevation="4" prepend-icon="mdi-arrow-down" @click="scrollToProducts">
          Prohlédnout nabídku
        </v-btn>
      </div>
    </v-parallax>

    <v-container class="py-8" id="products-section">
      <v-row>
        <!-- Sidebar Filters (Desktop) -->
        <v-col cols="12" md="3" class="d-none d-md-block">
          <v-card elevation="0" border class="pa-4 sticky-top">
            <h3 class="text-h6 font-weight-bold mb-4 d-flex align-center">
              <v-icon icon="mdi-filter-variant" class="mr-2"></v-icon>Filtrovat
            </h3>
            
            <!-- Category Filter -->
            <div class="mb-6">
              <h4 class="text-subtitle-1 font-weight-medium mb-2">Kategorie</h4>
              <v-checkbox
                v-for="cat in categories"
                :key="cat.id"
                v-model="selectedCategories"
                :label="cat.name"
                :value="cat.id"
                density="compact"
                hide-details
                color="primary"
                class="filter-checkbox"
              ></v-checkbox>
            </div>
            
            <v-divider class="mb-6"></v-divider>

            <!-- Brand Filter -->
            <div class="mb-6">
              <h4 class="text-subtitle-1 font-weight-medium mb-2">Značka</h4>
              <v-checkbox
                v-for="brand in brands"
                :key="brand.id"
                v-model="selectedBrands"
                :label="brand.name"
                :value="brand.id"
                density="compact"
                hide-details
                color="primary"
                class="filter-checkbox"
              ></v-checkbox>
            </div>

            <v-divider class="mb-6"></v-divider>

            <!-- Price Filter (Simple Min/Max inputs for now) -->
            <div class="mb-6">
              <h4 class="text-subtitle-1 font-weight-medium mb-2">Cena (Kč)</h4>
              <div class="d-flex align-center gap-2">
                <v-text-field
                  v-model.number="priceMin"
                  label="Od"
                  density="compact"
                  variant="outlined"
                  hide-details
                  type="number"
                  class="mr-2"
                ></v-text-field>
                <span class="text-grey">-</span>
                <v-text-field
                  v-model.number="priceMax"
                  label="Do"
                  density="compact"
                  variant="outlined"
                  hide-details
                  type="number"
                  class="ml-2"
                ></v-text-field>
              </div>
            </div>

            <!-- In Stock Switch -->
            <v-switch
              v-model="inStockOnly"
              label="Jen skladem"
              color="success"
              hide-details
              density="compact"
            ></v-switch>

            <v-btn 
              variant="text" 
              color="error" 
              class="mt-4 w-100" 
              size="small"
              @click="resetFilters"
              prepend-icon="mdi-refresh"
            >
              Resetovat filtry
            </v-btn>
          </v-card>
        </v-col>

        <!-- Main Content -->
        <v-col cols="12" md="9">
          <!-- Mobile Filters Dialog -->
          <v-dialog v-model="mobileFiltersOpen" fullscreen transition="dialog-bottom-transition">
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                variant="outlined"
                class="d-md-none mb-4 w-100"
                prepend-icon="mdi-filter"
              >
                Filtry a třídění
              </v-btn>
            </template>
            <v-card>
              <v-toolbar color="primary">
                <v-btn icon="mdi-close" @click="mobileFiltersOpen = false"></v-btn>
                <v-toolbar-title>Filtrovat produkty</v-toolbar-title>
                <v-toolbar-items>
                  <v-btn variant="text" @click="mobileFiltersOpen = false">Hotovo</v-btn>
                </v-toolbar-items>
              </v-toolbar>
              <v-card-text>
                <!-- Reuse filter logic here slightly simplified or same -->
                 <div class="mb-4">
                  <h4 class="text-subtitle-1 mb-2">Seřadit</h4>
                  <v-select
                    v-model="sortBy"
                    :items="sortOptions"
                    item-title="label"
                    item-value="value"
                    variant="outlined"
                    density="compact"
                  ></v-select>
                 </div>
                 <v-divider class="mb-4"></v-divider>
                 <!-- Categories Mobile -->
                  <h4 class="text-subtitle-1 mb-2">Kategorie</h4>
                  <v-checkbox
                    v-for="cat in categories"
                    :key="cat.id"
                    v-model="selectedCategories"
                    :label="cat.name"
                    :value="cat.id"
                    density="compact"
                    hide-details
                  ></v-checkbox>
                  <!-- Brands Mobile -->
                   <v-divider class="my-4"></v-divider>
                   <h4 class="text-subtitle-1 mb-2">Značky</h4>
                   <v-checkbox
                    v-for="brand in brands"
                    :key="brand.id"
                    v-model="selectedBrands"
                    :label="brand.name"
                    :value="brand.id"
                    density="compact"
                    hide-details
                  ></v-checkbox>
              </v-card-text>
            </v-card>
          </v-dialog>

          <!-- Top Toolbar: Search & Sort -->
          <v-row class="mb-4 align-center">
            <v-col cols="12" sm="8">
              <v-text-field
                v-model="search"
                prepend-inner-icon="mdi-magnify"
                label="Hledat produkt..."
                variant="solo"
                density="compact"
                hide-details
                single-line
                bg-color="grey-lighten-4"
                flat
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="4" class="d-none d-md-block">
               <v-select
                v-model="sortBy"
                :items="sortOptions"
                item-title="label"
                item-value="value"
                variant="solo"
                density="compact"
                hide-details
                flat
                bg-color="grey-lighten-4"
                label="Seřadit dle"
               ></v-select>
            </v-col>
          </v-row>

          <!-- Active Filters Chips -->
          <div class="mb-4" v-if="activeFilterCount > 0">
            <span class="text-caption text-grey mr-2">Aktivní filtry:</span>
            <v-chip
              v-for="catId in selectedCategories"
              :key="'cat-'+catId"
              closable
              size="small"
              class="mr-2 mb-1"
              @click:close="toggleCategory(catId)"
            >
              {{ getCategoryName(catId) }}
            </v-chip>
            <v-chip
              v-for="brandId in selectedBrands"
              :key="'brand-'+brandId"
              closable
              size="small"
              class="mr-2 mb-1"
              @click:close="toggleBrand(brandId)"
            >
              {{ getBrandName(brandId) }}
            </v-chip>
            <v-chip
               v-if="inStockOnly"
               closable
               size="small"
               class="mr-2 mb-1"
               color="success"
               @click:close="inStockOnly = false"
            >
              Jen skladem
            </v-chip>
             <v-chip
               v-if="priceMin || priceMax"
               closable
               size="small"
               class="mr-2 mb-1"
               @click:close="resetPrice"
            >
              Cena: {{ priceMin || 0 }} - {{ priceMax || 'max' }} Kč
            </v-chip>
          </div>

          <!-- Loading State -->
          <div v-if="loading" class="text-center py-12">
            <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
            <p class="mt-4 text-grey">Načítám produkty...</p>
          </div>

          <!-- Empty State -->
          <div v-else-if="filteredProducts.length === 0" class="text-center py-12 bg-grey-lighten-5 rounded-lg border">
            <v-icon icon="mdi-magnify-remove-outline" size="64" color="grey" class="mb-4"></v-icon>
            <h3 class="text-h6 text-grey-darken-2">Nenašli jsme žádné produkty</h3>
            <p class="text-body-2 text-grey">Zkuste upravit filtry nebo hledaný výraz.</p>
            <v-btn color="primary" variant="text" class="mt-2" @click="resetFilters">Zrušit všechny filtry</v-btn>
          </div>

          <!-- Product Grid -->
          <v-row v-else>
            <v-col
              v-for="product in filteredProducts"
              :key="product.id"
              cols="12"
              sm="6"
              lg="4"
              xl="3"
            >
              <v-card class="product-card h-100 d-flex flex-column" elevation="0" border hover>
                <div class="position-relative">
                   <v-img
                    :src="product.image"
                    height="200"
                    cover
                    class="bg-white"
                  >
                     <template v-slot:placeholder>
                        <div class="d-flex align-center justify-center fill-height bg-grey-lighten-4">
                          <v-progress-circular indeterminate size="24" color="grey"></v-progress-circular>
                        </div>
                      </template>
                  </v-img>
                  <v-chip
                    v-if="product.stock > 0 && product.stock < 5"
                    color="warning"
                    size="x-small"
                    class="position-absolute top-0 right-0 ma-2 font-weight-bold"
                  >
                    Poslední kusy
                  </v-chip>
                  <v-chip
                     v-if="product.stock === 0"
                     color="error"
                     size="x-small"
                     class="position-absolute top-0 right-0 ma-2 font-weight-bold"
                  >
                    Vyprodáno
                  </v-chip>
                </div>

                <v-card-item class="pb-0 pt-3">
                  <div class="text-caption text-grey text-uppercase font-weight-bold mb-1">
                    {{ getBrandName(product.brand_id) }}
                  </div>
                  <div class="text-subtitle-1 font-weight-bold lh-1-2 mb-1 text-truncate-2" style="min-height: 48px;">
                    {{ product.name }}
                  </div>
                   <v-rating
                    :model-value="product.rating"
                    color="amber"
                    density="compact"
                    half-increments
                    readonly
                    size="small"
                  ></v-rating>
                </v-card-item>

                <v-card-text class="flex-grow-1 pt-2">
                  <div class="text-h6 text-primary font-weight-bold">
                    {{ formatPrice(product.price) }}
                  </div>
                  <div class="text-caption text-grey" v-if="product.stock > 0">
                    <v-icon icon="mdi-check-circle" size="small" color="success" class="mr-1"></v-icon>
                    Skladem {{ product.stock }} ks
                  </div>
                  <div class="text-caption text-error" v-else>
                     <v-icon icon="mdi-close-circle" size="small" class="mr-1"></v-icon>
                     Není skladem
                  </div>
                </v-card-text>
                
                <v-card-actions class="pa-4 pt-0">
                  <v-btn
                    block
                    variant="flat"
                    color="primary"
                    prepend-icon="mdi-cart-plus"
                    @click="addToCart(product)"
                    :disabled="product.stock === 0"
                  >
                    Do košíku
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      
      <!-- Cart Snackbar -->
      <v-snackbar v-model="snackbar" timeout="3000" color="success" location="bottom right">
        <div class="d-flex align-center">
          <v-icon icon="mdi-check-circle-outline" class="mr-2"></v-icon>
          <span>{{ snackbarText }}</span>
        </div>
      </v-snackbar>
    </v-container>
  </div>
</template>

<script>
// Logic
import { supabase } from '../supabase'

export default {
  name: 'ProdejnaView',
  data() {
    return {
      products: [],
      categories: [],
      brands: [],
      
      // Filters
      search: '',
      selectedCategories: [],
      selectedBrands: [],
      priceMin: null,
      priceMax: null,
      inStockOnly: false,
      
      // Sorting
      sortBy: 'default',
      sortOptions: [
        { label: 'Doporučeno', value: 'default' },
        { label: 'Nejlevnější', value: 'price_asc' },
        { label: 'Nejdražší', value: 'price_desc' },
        { label: 'Abecedně A-Z', value: 'name_asc' },
      ],

      // UI State
      loading: false,
      mobileFiltersOpen: false,
      snackbar: false,
      snackbarText: ''
    }
  },
  computed: {
    activeFilterCount() {
      let count = 0;
      count += this.selectedCategories.length;
      count += this.selectedBrands.length;
      if (this.inStockOnly) count++;
      if (this.priceMin || this.priceMax) count++;
      return count;
    },
    filteredProducts() {
      let result = [...this.products];

      // 1. Search
      if (this.search) {
        const term = this.search.toLowerCase();
        result = result.filter(p => 
          p.name.toLowerCase().includes(term) || 
          (p.description && p.description.toLowerCase().includes(term))
        );
      }

      // 2. Categories
      if (this.selectedCategories.length > 0) {
        result = result.filter(p => this.selectedCategories.includes(p.category_id));
      }

      // 3. Brands
      if (this.selectedBrands.length > 0) {
        result = result.filter(p => this.selectedBrands.includes(p.brand_id));
      }

      // 4. Price
      if (this.priceMin !== null && this.priceMin !== '') {
        result = result.filter(p => p.price >= this.priceMin);
      }
      if (this.priceMax !== null && this.priceMax !== '') {
        result = result.filter(p => p.price <= this.priceMax);
      }

      // 5. Stock
      if (this.inStockOnly) {
         result = result.filter(p => p.stock > 0);
      }

      // 6. Sorting
      if (this.sortBy === 'price_asc') {
        result.sort((a, b) => a.price - b.price);
      } else if (this.sortBy === 'price_desc') {
        result.sort((a, b) => b.price - a.price);
      } else if (this.sortBy === 'name_asc') {
        result.sort((a, b) => a.name.localeCompare(b.name));
      }
      
      return result;
    }
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      this.loading = true;
      try {
        // Fetch categories
        const { data: categoriesData, error: catError } = await supabase.from('categories').select('*');
        if (catError) console.error("Error fetching categories:", catError);
        else this.categories = categoriesData;

        // Fetch brands
        const { data: brandsData, error: brandError } = await supabase.from('brands').select('*');
        if (brandError) console.error("Error fetching brands:", brandError);
        else this.brands = brandsData;

        // Fetch products
        const { data: productsData, error: prodError } = await supabase.from('products').select('*');
        if (prodError) console.error("Error fetching products:", prodError);
        else this.products = productsData;
        
      } catch (err) {
        console.error("Unexpected error:", err);
      } finally {
        this.loading = false;
      }
    },
    formatPrice(price) {
      return new Intl.NumberFormat('cs-CZ', { style: 'currency', currency: 'CZK', maximumFractionDigits: 0 }).format(price);
    },
    getCategoryName(id) {
      const c = this.categories.find(x => x.id === id);
      return c ? c.name : id;
    },
    getBrandName(id) {
       const b = this.brands.find(x => x.id === id);
       return b ? b.name : id;
    },
    addToCart(product) {
      this.snackbarText = `Produkt "${product.name}" byl přidán do košíku.`;
      this.snackbar = true;
    },
    resetFilters() {
      this.selectedCategories = [];
      this.selectedBrands = [];
      this.search = '';
      this.priceMin = null;
      this.priceMax = null;
      this.inStockOnly = false;
    },
    resetPrice() {
      this.priceMin = null;
      this.priceMax = null;
    },
    toggleCategory(id) {
      const index = this.selectedCategories.indexOf(id);
      if (index >= 0) this.selectedCategories.splice(index, 1);
    },
    toggleBrand(id) {
      const index = this.selectedBrands.indexOf(id);
      if (index >= 0) this.selectedBrands.splice(index, 1);
    },
    scrollToProducts() {
      const el = document.getElementById('products-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
</script>
