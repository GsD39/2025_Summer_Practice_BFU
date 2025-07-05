<template>
    <div class="register-container">
      <div class="register-header">
        <h2>Create an Account</h2>
        <p>Join our university community</p>
      </div>
  
      <form @submit.prevent="handleRegister" class="register-form">
        <div class="form-group">
          <label for="name">Full Name</label>
          <div class="input-with-icon">
            <i class="fas fa-user"></i>
            <input 
              type="text" 
              id="name" 
              v-model="formData.name" 
              placeholder="Enter your full name"
              required
            >
          </div>
        </div>
  
        <div class="form-group">
          <label for="email">University Email</label>
          <div class="input-with-icon">
            <i class="fas fa-envelope"></i>
            <input 
              type="email" 
              id="email" 
              v-model="formData.email" 
              placeholder="name@university.edu"
              required
            >
          </div>
        </div>
  
        <div class="form-row">
          <div class="form-group">
            <label for="password">Password</label>
            <div class="input-with-icon">
              <i class="fas fa-lock"></i>
              <input 
                :type="showPassword ? 'text' : 'password'" 
                id="password" 
                v-model="formData.password" 
                placeholder="Create a password"
                required
              >
              <button type="button" class="password-toggle" @click="showPassword = !showPassword">
                <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
              </button>
            </div>
            <div class="password-strength">
              <div :class="['strength-bar', strengthClass]"></div>
              <span>{{ strengthText }}</span>
            </div>
          </div>
  
          <div class="form-group">
            <label for="confirmPassword">Confirm Password</label>
            <div class="input-with-icon">
              <i class="fas fa-lock"></i>
              <input 
                type="password" 
                id="confirmPassword" 
                v-model="formData.confirmPassword" 
                placeholder="Confirm your password"
                required
              >
            </div>
            <div v-if="formData.password && formData.confirmPassword && !passwordsMatch" class="error-message">
              Passwords do not match
            </div>
          </div>
        </div>
  
        <div class="form-group">
          <label>Role</label>
          <div class="role-selector">
            <div 
              v-for="role in roles" 
              :key="role.value" 
              :class="['role-card', { active: formData.role === role.value }]"
              @click="formData.role = role.value"
            >
              <i :class="role.icon"></i>
              <h3>{{ role.title }}</h3>
              <p>{{ role.description }}</p>
            </div>
          </div>
        </div>
  
        <div class="form-group">
          <label for="studentId">Student/Staff ID</label>
          <div class="input-with-icon">
            <i class="fas fa-id-card"></i>
            <input 
              type="text" 
              id="studentId" 
              v-model="formData.studentId" 
              placeholder="Enter your university ID"
              required
            >
          </div>
        </div>
  
        <div class="form-group terms">
          <input 
            type="checkbox" 
            id="terms" 
            v-model="formData.agreedToTerms"
            required
          >
          <label for="terms">
            I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
          </label>
        </div>
  
        <button type="submit" class="register-btn" :disabled="isSubmitting">
          <span v-if="!isSubmitting">Create Account</span>
          <span v-else>Creating Account...</span>
          <i class="fas fa-arrow-right"></i>
        </button>
  
        <div v-if="errorMessage" class="error-message server-error">
          <i class="fas fa-exclamation-circle"></i> {{ errorMessage }}
        </div>
      </form>
  
      <div class="login-redirect">
        <p>Already have an account? <a href="#" @click.prevent="switchToLogin">Log in</a></p>
      </div>
  
      <div class="university-logo">
        <div class="logo-placeholder">
          <i class="fas fa-graduation-cap"></i>
          <span>University</span>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { mapActions } from 'vuex'
  
  export default {
    name: 'RegisterForm',
    data() {
      return {
        formData: {
          name: '',
          email: '',
          password: '',
          confirmPassword: '',
          role: 'student',
          studentId: '',
          agreedToTerms: false
        },
        showPassword: false,
        isSubmitting: false,
        errorMessage: '',
        roles: [
          {
            value: 'student',
            title: 'Student',
            description: 'Access your class schedule, assignments, and grades',
            icon: 'fas fa-user-graduate'
          },
          {
            value: 'teacher',
            title: 'Teacher',
            description: 'Manage courses, schedule, and student interactions',
            icon: 'fas fa-chalkboard-teacher'
          },
          {
            value: 'admin',
            title: 'Administrator',
            description: 'Manage university resources and user accounts',
            icon: 'fas fa-user-cog'
          }
        ]
      }
    },
    computed: {
      passwordsMatch() {
        return this.formData.password === this.formData.confirmPassword
      },
      passwordStrength() {
        if (!this.formData.password) return 0
        
        let strength = 0
        if (this.formData.password.length >= 8) strength += 1
        if (/[A-Z]/.test(this.formData.password)) strength += 1
        if (/[0-9]/.test(this.formData.password)) strength += 1
        if (/[^A-Za-z0-9]/.test(this.formData.password)) strength += 1
        
        return strength
      },
      strengthClass() {
        if (this.passwordStrength <= 1) return 'weak'
        if (this.passwordStrength === 2) return 'medium'
        if (this.passwordStrength >= 3) return 'strong'
        return ''
      },
      strengthText() {
        if (!this.formData.password) return 'Enter a password'
        if (this.passwordStrength <= 1) return 'Weak password'
        if (this.passwordStrength === 2) return 'Medium strength'
        if (this.passwordStrength >= 3) return 'Strong password'
        return ''
      }
    },
    methods: {
      ...mapActions('auth', ['register']),
      async handleRegister() {
        // Simple validation
        if (!this.passwordsMatch) {
          this.errorMessage = 'Passwords do not match'
          return
        }
        
        if (!this.formData.agreedToTerms) {
          this.errorMessage = 'You must agree to the terms and conditions'
          return
        }
        
        this.isSubmitting = true
        this.errorMessage = ''
        
        try {
          await this.register({
            name: this.formData.name,
            email: this.formData.email,
            password: this.formData.password,
            role: this.formData.role,
            studentId: this.formData.studentId
          })
          
          // On successful registration, redirect to home
          this.$router.push('/')
        } catch (error) {
          this.errorMessage = error.response?.data?.message || 'Registration failed. Please try again.'
        } finally {
          this.isSubmitting = false
        }
      },
      switchToLogin() {
        this.$emit('switch-tab')
      }
    }
  }
  </script>
  
  <style scoped>
  .register-container {
    max-width: 500px;
    margin: 0 auto;
    padding: 30px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  }
  
  .register-header {
    text-align: center;
    margin-bottom: 30px;
  }
  
  .register-header h2 {
    color: #2c3e50;
    font-size: 28px;
    margin-bottom: 8px;
  }
  
  .register-header p {
    color: #7f8c8d;
    font-size: 16px;
  }
  
  .register-form {
    margin-bottom: 25px;
  }
  
  .form-group {
    margin-bottom: 20px;
  }
  
  .form-row {
    display: flex;
    gap: 20px;
  }
  
  .form-row .form-group {
    flex: 1;
  }
  
  label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
    color: #2c3e50;
    font-size: 14px;
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
  
  input {
    width: 100%;
    padding: 14px 14px 14px 45px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    font-size: 16px;
    transition: all 0.3s;
  }
  
  input:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
  }
  
  .password-toggle {
    position: absolute;
    right: 15px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: #7f8c8d;
    cursor: pointer;
    font-size: 16px;
  }
  
  .password-strength {
    margin-top: 8px;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  
  .strength-bar {
    flex: 1;
    height: 5px;
    border-radius: 3px;
    background: #e0e0e0;
    overflow: hidden;
  }
  
  .strength-bar::before {
    content: '';
    display: block;
    height: 100%;
    width: 0;
    transition: width 0.3s;
  }
  
  .strength-bar.weak::before {
    width: 33%;
    background: #e74c3c;
  }
  
  .strength-bar.medium::before {
    width: 66%;
    background: #f39c12;
  }
  
  .strength-bar.strong::before {
    width: 100%;
    background: #2ecc71;
  }
  
  .password-strength span {
    font-size: 12px;
    color: #7f8c8d;
  }
  
  .role-selector {
    display: flex;
    gap: 15px;
    margin-top: 10px;
  }
  
  .role-card {
    flex: 1;
    padding: 15px;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s;
  }
  
  .role-card:hover {
    border-color: #3498db;
    transform: translateY(-3px);
  }
  
  .role-card.active {
    border-color: #3498db;
    background: #e3f2fd;
  }
  
  .role-card i {
    font-size: 24px;
    color: #3498db;
    margin-bottom: 10px;
  }
  
  .role-card h3 {
    margin: 0 0 5px;
    font-size: 16px;
    color: #2c3e50;
  }
  
  .role-card p {
    margin: 0;
    font-size: 12px;
    color: #7f8c8d;
  }
  
  .terms {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 20px;
  }
  
  .terms input {
    width: auto;
    padding: 0;
    margin: 0;
  }
  
  .terms label {
    margin: 0;
    font-size: 14px;
    font-weight: normal;
  }
  
  .terms a {
    color: #3498db;
    text-decoration: none;
  }
  
  .terms a:hover {
    text-decoration: underline;
  }
  
  .register-btn {
    width: 100%;
    padding: 16px;
    background: linear-gradient(135deg, #3498db, #2c3e50);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: all 0.3s;
    margin-top: 20px;
  }
  
  .register-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3);
  }
  
  .register-btn:disabled {
    background: #bdc3c7;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
  
  .error-message {
    color: #e74c3c;
    font-size: 14px;
    margin-top: 5px;
  }
  
  .server-error {
    background: #fce4e2;
    padding: 12px;
    border-radius: 8px;
    margin-top: 20px;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  
  .login-redirect {
    text-align: center;
    padding-top: 20px;
    border-top: 1px solid #eee;
  }
  
  .login-redirect p {
    margin: 0;
    color: #7f8c8d;
  }
  
  .login-redirect a {
    color: #3498db;
    text-decoration: none;
    font-weight: 500;
  }
  
  .login-redirect a:hover {
    text-decoration: underline;
  }
  
  .university-logo {
    text-align: center;
    margin-top: 30px;
    padding-top: 20px;
    border-top: 1px solid #eee;
  }
  
  .logo-placeholder {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    font-size: 20px;
    font-weight: 600;
    color: #2c3e50;
  }
  
  .logo-placeholder i {
    font-size: 28px;
    color: #3498db;
  }
  
  /* Responsive adjustments */
  @media (max-width: 600px) {
    .register-container {
      padding: 20px;
    }
    
    .form-row {
      flex-direction: column;
      gap: 15px;
    }
    
    .role-selector {
      flex-direction: column;
    }
  }
  </style>