<template>
    <form @submit.prevent="handleLogin">
      <h2>Login</h2>
      <div class="form-group">
        <label>Email</label>
        <input v-model="email" type="email" required>
      </div>
      <div class="form-group">
        <label>Password</label>
        <input v-model="password" type="password" required>
      </div>
      <button type="submit">Login</button>
      <p class="switch-text">Don't have an account? <a href="#" @click.prevent="$emit('switch-tab')">Register</a></p>
    </form>
  </template>
  
  <script>
  import { mapActions } from 'vuex'
  
  export default {
    data() {
      return {
        email: '',
        password: ''
      }
    },
    methods: {
      ...mapActions('auth', ['login']),
      async handleLogin() {
        try {
          await this.login({
            email: this.email,
            password: this.password
          })
          this.$router.push('/')
        } catch (error) {
          alert('Login failed: ' + error.message)
        }
      }
    }
  }
  </script>