<template>
  <div class="login-form">
    <h2>University Login</h2>
    
    <div v-if="errorMessage" class="error-message">
      <i class="fas fa-exclamation-circle"></i> {{ errorMessage }}
    </div>
    
    <form @submit.prevent="handleLogin">
      <div class="form-group">
        <label>Email Address</label>
        <div class="input-with-icon">
          <i class="fas fa-envelope"></i>
          <input 
            v-model="email" 
            type="email" 
            placeholder="your.email@university.edu" 
            required
          >
        </div>
      </div>
      
      <div class="form-group">
        <label>Password</label>
        <div class="input-with-icon">
          <i class="fas fa-lock"></i>
          <input 
            v-model="password" 
            :type="showPassword ? 'text' : 'password'" 
            placeholder="Enter your password" 
            required
          >
          <button 
            type="button" 
            class="toggle-password" 
            @click="showPassword = !showPassword"
          >
            <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
          </button>
        </div>
      </div>
      
      <button type="submit" class="login-btn" :disabled="isLoading">
        <i class="fas fa-sign-in-alt"></i> 
        {{ isLoading ? 'Logging in...' : 'Login to System' }}
      </button>
    </form>
    
    <div class="footer">
      <p>Need help? Contact IT support at support@university.edu</p>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  data() {
    return {
      email: '',
      password: '',
      showPassword: false,
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
        
        // Add this delay to ensure Vuex state updates propagate
        await new Promise(resolve => setTimeout(resolve, 50))
        
        const redirect = this.$route.query.redirect || '/schedule'
        console.log(redirect)
        this.$router.replace(redirect)
        
      } catch (error) {
        // Error handling remains the same
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>

<style scoped>
.login-form {
  max-width: 450px;
  margin: 0 auto;
  padding: 2.5rem;
  background: white;
  border-radius: 10px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 1.5rem;
  font-size: 1.8rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #2c3e50;
}

.input-with-icon {
  position: relative;
}

.input-with-icon i {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #7f8c8d;
}

.input-with-icon input {
  width: 100%;
  padding: 12px 15px 12px 45px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.input-with-icon input:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
}

.toggle-password {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #7f8c8d;
  cursor: pointer;
}

.login-btn {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #3498db, #2c3e50);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  transition: all 0.3s;
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(52, 152, 219, 0.4);
}

.login-btn:disabled {
  background: #bdc3c7;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.error-message {
  background: #fce4e2;
  color: #e74c3c;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 10px;
}

.footer {
  margin-top: 2rem;
  text-align: center;
  color: #7f8c8d;
  font-size: 0.9rem;
}
</style>