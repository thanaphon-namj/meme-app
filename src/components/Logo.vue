<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <RouterLink :to="{ name: 'home' }" class="navbar-brand bold">
    <img src="@/assets/logo.png" width="38" height="38" alt="Logo" />
    Meme App
  </RouterLink>
</template>
