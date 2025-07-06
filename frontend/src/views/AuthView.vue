<template>
  <div class="auth-view">
    <div class="university-header">
      <h1>University Schedule System</h1>
      <p>Manage your academic schedule efficiently</p>
    </div>
    
    <div class="auth-container">
      <div class="auth-card">
        <LoginForm />
      </div>
    </div>
    
    <div class="auth-footer">
      <p>Secure access to university resources</p>
    </div>
  </div>
</template>

<script>
import LoginForm from '@/components/auth/LoginForm.vue'

export default {
  components: { LoginForm }
}
</script>

<style scoped>
.auth-view {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: linear-gradient(120deg, #1a2a6c, #b21f1f, #1a2a6c);
  background-size: 400% 400%;
  animation: gradientBG 15s ease infinite;
}

@keyframes gradientBG {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.university-header {
  text-align: center;
  padding: 3rem 2rem 2rem;
  color: white;
}

.university-header h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.university-header p {
  font-size: 1.2rem;
  opacity: 0.9;
}

.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  flex: 1;
}

.auth-card {
  width: 100%;
  max-width: 500px;
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.auth-footer {
  text-align: center;
  padding: 1.5rem;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
}
</style>