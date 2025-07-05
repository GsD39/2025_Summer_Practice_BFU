<template>
  <div class="admin-view">
    <h1>Admin Panel</h1>
    
    <div class="admin-tabs">
      <button @click="activeTab = 'users'" :class="{ active: activeTab === 'users' }">
        User Management
      </button>
    </div>
    
    <UserManagement v-if="activeTab === 'users'" />
  </div>
</template>

<script>
import UserManagement from '@/components/admin/UserManagement.vue'

export default {
  components: { UserManagement },
  data() {
    return {
      activeTab: 'users'
    }
  }
}
</script>