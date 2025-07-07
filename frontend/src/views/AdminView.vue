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
      <button @click="activeTab = 'lectures'" :class="{ active: activeTab === 'users' }">
        Lectures Management
      </button>
    </div>
    
    <UserManagement v-if="activeTab === 'users'" />
    <ScheduleEditor v-if="activeTab === 'schedule'" />
    <LectureForm v-if="activeTab === 'lectures'" />
  </div>
</template>

<script>
import UserManagement from '@/components/admin/UserManagement.vue'
import ScheduleEditor from '@/components/admin/ScheduleEditor.vue'
import LectureForm from '@/components/admin/LectureForm.vue'

export default {
  components: { UserManagement, ScheduleEditor, LectureForm },
  data() {
    return {
      activeTab: 'users'
    }
  }
}
</script>