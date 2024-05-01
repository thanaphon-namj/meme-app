<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="container py-5">
    <div class="row align-items-center text-center py-5">
      <div class="col-8 mx-auto">
        <h1 class="display-1">404</h1>
        <h2 class="mb-5">Page Not Found!</h2>
        <RouterLink :to="{ name: 'home' }">
          <button type="button" class="btn btn-primary">Go to Home</button>
        </RouterLink>
      </div>
    </div>
  </div>
</template>
