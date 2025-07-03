<template>
  <div class="auth-view">
    <div class="auth-container">
      <LoginForm v-if="activeTab === 'login'" @switch-tab="activeTab = 'register'" />
      <RegisterForm v-else @switch-tab="activeTab = 'login'" />
    </div>
  </div>
</template>

<script>
import LoginForm from '@/components/auth/LoginForm.vue'
import RegisterForm from '@/components/auth/RegisterForm.vue'

export default {
  components: { LoginForm, RegisterForm },
  data() {
    return {
      activeTab: 'login'
    }
  }
}
</script>

<style scoped>
.auth-view {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
}
.auth-container {
  width: 100%;
  max-width: 400px;
  padding: 2rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}
</style>