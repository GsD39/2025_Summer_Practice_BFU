<template>
    <div class="admin-view">
      <h1>Admin Panel</h1>
      <div class="admin-tabs">
        <button 
          @click="activeTab = 'users'" 
          :class="{ active: activeTab === 'users' }"
        >
          Управление пользователями
        </button>
        <button 
          @click="activeTab = 'schedule'" 
          :class="{ active: activeTab === 'schedule' }"
        >
          Schedule Editor
        </button>
      </div>
      
      <UserManagement v-if="activeTab === 'users'" />
      <ScheduleEditor v-else />
    </div>
  </template>
  
  <script>
  import UserManagement from '@/components/admin/UserManagement.vue'
  import ScheduleEditor from '@/components/admin/ScheduleEditor.vue'
  
  export default {
    components: { UserManagement, ScheduleEditor },
    data() {
      return {
        activeTab: 'users'
      }
    }
  }
  </script>
  
  <style scoped>
  .admin-tabs {
    margin: 20px 0;
  }
  .admin-tabs button {
    padding: 10px 20px;
    margin-right: 10px;
    border: none;
    background: #eee;
    cursor: pointer;
  }
  .admin-tabs button.active {
    background: #3498db;
    color: white;
  }
  </style>