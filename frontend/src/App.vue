<template>
  <div>
    <nav>
      <router-link to="/">Home</router-link>
      |
      <router-link to="/fairness">Provably Fair</router-link>
      |
      <router-link to="/admin">Admin</router-link>
    </nav>
    <router-view></router-view>
  </div>
</template>
