<template>
  <div id="app">
    <header>
      <img alt="University Logo" src="./assets/logo.png" class="logo">
      <nav>
        <router-link to="/">Schedule</router-link>
        <router-link to="/admin" v-if="isAdmin">Admin</router-link>
        <button v-if="isAuthenticated" @click="logout">Logout</button>
        <router-link v-else to="/auth">Login</router-link>
      </nav>
    </header>
    <main>
      <router-view />
    </main>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  computed: {
    ...mapGetters('auth', ['isAuthenticated', 'isAdmin'])
  },
  methods: {
    ...mapActions('auth', ['logoutUser']),
    async logout() {
      await this.logout()
      this.$router.push('/auth')
    }
  }
}
</script>

<style>
#app {
  font-family: Arial, sans-serif;
}
header {
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  background: #2c3e50;
  color: white;
}
.logo {
  height: 40px;
}
nav a {
  color: white;
  margin: 0 10px;
  text-decoration: none;
}
nav button {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 1rem;
}
</style>