<template>
  <div class="admin-view">
    <div class="admin-container">
      <h1 class="admin-header">Admin Panel</h1>
      
      <div class="admin-tabs">
        <button 
          @click="activeTab = 'users'" 
          :class="{ 'tab-active': activeTab === 'users' }"
          class="tab-button"
        >
          <font-awesome-icon icon="fa-users" /> User Management
        </button>
        <button 
          @click="activeTab = 'schedule'" 
          :class="{ 'tab-active': activeTab === 'schedule' }"
          class="tab-button"
        >
          <font-awesome-icon icon="fa-calendar-alt" /> Schedule Management
        </button>
      </div>
      
      <div class="admin-content">
        <UserManagement v-if="activeTab === 'users'" />
        <ScheduleEditor v-if="activeTab === 'schedule'" />
      </div>
    </div>
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
.admin-view {
  padding: 20px;
  background: #f8f9fa;
  min-height: 100vh;
}

.admin-container {
  max-width: 1200px;
  margin: 0 auto;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.admin-header {
  padding: 25px 30px;
  margin: 0;
  background: #2c3e50;
  color: white;
  font-size: 1.8rem;
}

.admin-tabs {
  display: flex;
  border-bottom: 1px solid #e0e0e0;
  padding: 0 20px;
  background: #f8f9fa;
}

.tab-button {
  padding: 15px 25px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  color: #7f8c8d;
  display: flex;
  align-items: center;
  gap: 10px;
  border-bottom: 3px solid transparent;
  transition: all 0.3s;
}

.tab-button:hover {
  color: #3498db;
  background: rgba(236, 240, 241, 0.5);
}

.tab-active {
  color: #3498db;
  border-bottom: 3px solid #3498db;
}

.admin-content {
  padding: 25px;
}
</style>