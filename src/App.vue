<script setup lang="ts">
  import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="flex h-screen w-screen">
    <header class="flex flex-col text-center">
        <h1 class="py-5 text-4xl">Thyme CMS</h1>
    
        <nav class="h-fit flex flex-col">
          <RouterLink to="/" class="route-option">Add Recipe</RouterLink>
          <RouterLink to="/view" class="route-option">View Recipes</RouterLink>
          <RouterLink to="/playground" class="route-option">Playground Page</RouterLink>
        </nav>
    </header>

    <RouterView class="w-full py-10 overflow-y-scroll" />
  </div>
</template>

<style scoped>

  header {
    background-color: var(--thymeNav);
  }

  nav {
    display: flex;
    flex-wrap: wrap;
    font-size: 18px;
  }

  .route-option {
    padding: 25px 0px;
    text-align: center;
    color: var(--text-black);
  }

  nav a.router-link-exact-active {
    background-color: var(--nav-active-highlight);
  }

  nav a:hover {
    background-color: var(--nav-highlight)
  }


</style>
