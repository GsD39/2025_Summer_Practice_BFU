<template>
  <div id="app">
    <header>
      <div class="logo">
        <router-link to="/">
          <i class="fas fa-graduation-cap"></i>
          University Schedule
        </router-link>
      </div>
      
      <nav>
        <router-link to="/schedule">Schedule</router-link>
        <router-link v-if="isAdmin" to="/admin">Admin Panel</router-link>
        
        <div class="auth-actions">
          <template v-if="isAuthenticated">
            <span class="user-email">{{ currentUser.email }}</span>
            <button @click="logout" class="logout-btn">
              <i class="fas fa-sign-out-alt"></i> Logout
            </button>
          </template>
          <router-link v-else to="/auth" class="login-btn">
            <i class="fas fa-sign-in-alt"></i> Login
          </router-link>
        </div>
      </nav>
    </header>
    
    <main>
      <router-view />
    </main>
    
    <footer>
      <p>&copy; {{ new Date().getFullYear() }} University Schedule System</p>
    </footer>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  computed: {
    ...mapGetters('auth', ['isAuthenticated', 'isAdmin', 'currentUser'])
  },
  methods: {
    ...mapActions('auth', ['logout']),
    
    async handleLogout() {
      await this.logout()
      this.$router.push({ name: 'Auth' })
    }
  }
}
</script>

<style scoped>
#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

header {
  background: #2c3e50;
  color: white;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.logo a {
  display: flex;
  align-items: center;
  gap: 10px;
  color: white;
  text-decoration: none;
  font-size: 1.5rem;
  font-weight: bold;
}

.logo i {
  font-size: 2rem;
  color: #3498db;
}

nav {
  display: flex;
  align-items: center;
  gap: 20px;
}

nav a {
  color: white;
  text-decoration: none;
  padding: 8px 15px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

nav a.router-link-exact-active {
  background-color: #3498db;
}

.auth-actions {
  display: flex;
  align-items: center;
  gap: 15px;
}

.user-email {
  font-size: 0.9rem;
  color: #bdc3c7;
}

.logout-btn, .login-btn {
  background: #e74c3c;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  transition: background-color 0.3s;
}

.logout-btn:hover {
  background: #c0392b;
}

.login-btn {
  background: #2ecc71;
  text-decoration: none;
}

.login-btn:hover {
  background: #27ae60;
}

main {
  flex: 1;
  padding: 2rem;
}

footer {
  background: #34495e;
  color: white;
  text-align: center;
  padding: 1rem;
  margin-top: auto;
}
</style>