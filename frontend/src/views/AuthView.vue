<template>
  <div class="auth-view">
    <div class="auth-container">
      <LoginForm />
    </div>
  </div>
</template>

<script>
import LoginForm from '@/components/auth/LoginForm.vue'

export default {
  components: { LoginForm }
}
</script>