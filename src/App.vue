<script setup lang="ts">
  import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="flex h-max w-screen">
    <header class="lg:w-[10%] md:w-[20%]">
      <div class="flex flex-col text-center">
        <h1 class="pt-5 pb-5 text-4xl">Thyme CMS</h1>
    
        <nav class="flex flex-col">
          <RouterLink to="/" class="route-option ">Add Recipe</RouterLink>
          <RouterLink to="/view" class="route-option">View Recipes</RouterLink>
        </nav>
      </div>
    </header>

    <RouterView class="lg:w-[90%] p-10 md:w-[85vw]" />
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
