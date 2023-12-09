<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="flex h-screen divide-x ">
    <header>
      <div class="flex flex-col text-center">
        <h1 class="pt-10 text-4xl">Thyme CMS</h1>
    
        <nav class="flex flex-col">
          <RouterLink to="/" class="route-option ">Add Recipe</RouterLink>
          <RouterLink to="/view" class="route-option">View Recipes</RouterLink>
        </nav>
      </div>
    </header>

    <RouterView class="w-screen p-10" />
  </div>
</template>

<style scoped>

  header {
    background-color: var(--vt-c-thymeSecondary);
  }

  nav {
    display: flex;
    flex-wrap: wrap;
    font-size: 16px;
    background-color: var(--vt-c-thymeTertiary);
  }

  .route-option {
    padding: 25px 0px;
    text-align: center;
  }

  nav a.router-link-exact-active {
    background-color: var(--vt-c-nav-highlight);
  }

</style>
