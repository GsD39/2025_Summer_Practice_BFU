<template>
  <div class="admin-view">
    <h1>Admin Panel</h1>
    
    <div class="admin-tabs">
      <button @click="activeTab = 'users'" :class="{ active: activeTab === 'users' }">
        User Management
      </button>
      <button @click="activeTab = 'schedule'" :class="{ active: activeTab === 'users' }">
        Schedule Management
      </button>
    </div>
    
    <UserManagement v-if="activeTab === 'users'" />
    <ScheduleEditor v-if="activeTab === 'schedule'" />
  </div>
</template>

<script>
import UserManagement from '@/components/admin/UserManagement.vue'
import ScheduleEditor from '@/components/admin/ScheduleEditor.vue'

export default {
  components: { UserManagement, ScheduleEditor},
  data() {
    return {
      activeTab: 'users'
    }
  }
}
</script>