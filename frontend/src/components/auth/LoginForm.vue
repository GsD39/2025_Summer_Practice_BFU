<template>
  <form @submit.prevent="handleLogin">
    <h2>University Login</h2>
    
    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>
    
    <div class="form-group">
      <label>University Email</label>
      <input v-model="email" type="email" required>
    </div>
    
    <div class="form-group">
      <label>Password</label>
      <input v-model="password" type="password" required>
    </div>
    
    <button type="submit" :disabled="isLoading">
      {{ isLoading ? 'Logging in...' : 'Login' }}
    </button>
  </form>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  data() {
    return {
      email: '',
      password: '',
      isLoading: false,
      errorMessage: ''
    }
  },
  methods: {
    ...mapActions('auth', ['login']),
    async handleLogin() {
      this.isLoading = true
      this.errorMessage = ''
      
      try {
        await this.login({
          email: this.email,
          password: this.password
        })
        this.$router.push('/schedule')
      } catch (error) {
        this.errorMessage = error.response?.data?.error || 'Login failed. Please try again.'
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>