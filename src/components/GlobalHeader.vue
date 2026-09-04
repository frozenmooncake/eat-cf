<script setup>
const base = window.location.pathname.includes('/pages/') ? '../' : './';
</script>

<template>
  <header class="site-header">
    <div class="container">
      <a :href="base" class="site-logo">
        <span class="logo-icon">🍽️</span>
        <span class="logo-text">华水美食盲盒</span>
        <span class="logo-stamp">江淮</span>
      </a>
    </div>
  </header>
</template>

<style scoped>
.site-logo {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  color: var(--color-text);
  text-decoration: none;
}

.logo-icon {
  font-size: 1.5rem;
  line-height: 1;
}

.logo-text {
  font-family: var(--font-family-serif);
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--color-primary);
  letter-spacing: 0.04em;
}

.logo-stamp {
  display: inline-block;
  padding: 0.15rem 0.5rem;
  color: #faf6ee;
  background: var(--color-accent-strong);
  border-radius: 6px;
  font-family: var(--font-family-serif);
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  transform: rotate(-3deg);
}
</style>
