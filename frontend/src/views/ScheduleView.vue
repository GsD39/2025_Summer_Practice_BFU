<template>
  <div class="schedule-view">
    <div class="schedule-container">
      <div class="schedule-header">
        <h1>
          <font-awesome-icon icon="fa-calendar-alt" /> University Schedule
        </h1>
      </div>
      
      <div class="filter-section">
        <ScheduleFilter 
          :groups="groups"
          :teachers="teachers"
          @filter-change="handleFilterChange"
        />
      </div>
      
      <div class="schedule-content">
        <div v-if="isLoading" class="loading-state">
          <font-awesome-icon icon="fa-spinner" spin size="2x" />
          <p>Loading schedule...</p>
        </div>
        
        <div v-else-if="error" class="error-state">
          <font-awesome-icon icon="fa-exclamation-triangle" size="2x" />
          <p>{{ error }}</p>
          <button @click="loadSchedule" class="retry-btn">
            <font-awesome-icon icon="fa-redo" /> Try Again
          </button>
        </div>
        
        <ScheduleTable v-else :schedule="formattedSchedule" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import ScheduleFilter from '@/components/schedule/ScheduleFilter.vue'
import ScheduleTable from '@/components/schedule/ScheduleTable.vue'

export default {
  components: { ScheduleFilter, ScheduleTable },
  data() {
    return {
      filter: {
        type: 'group',
        value: '',
        date: null
      },
    }
  },
  computed: {
    ...mapState('schedule', ['schedule', 'groups', 'teachers', 'isLoading', 'error']),
    
    formattedSchedule() {
      if (!this.schedule) return [];
      
      return this.schedule.map(lecture => ({
        id: lecture.id,
        subject: lecture.subject,
        group: lecture.group,
        teacher: lecture.teacher,
        room: lecture.room,
        day: lecture.day.charAt(0).toUpperCase() + lecture.day.slice(1),
        time: `${lecture.start_time}-${lecture.end_time}`,
        week_type: lecture.week_type
      }));
    }
  },
  methods: {
    ...mapActions('schedule', [
      'fetchGroupSchedule',
      'fetchTeacherSchedule',
      'fetchGroups',
      'fetchTeachers'
    ]),
    
    handleFilterChange(filter) {
      this.filter = filter
      this.loadSchedule()
    },
    
    async loadSchedule() {
      if (!this.filter.value) return
      
      try {
        if (this.filter.type === 'group') {
          await this.fetchGroupSchedule({
            group: this.filter.value,
            date: this.filter.date
          })
        } else {
          await this.fetchTeacherSchedule({
            teacher: this.filter.value,
            date: this.filter.date
          })
        }
      } catch (error) {
        console.error('Failed to load schedule:', error)
      }
    }
  },
  async created() {
    await this.fetchGroups();
    await this.fetchTeachers();

    if (this.$route.query.group) {
      this.filter.type = 'group'
      this.filter.value = this.$route.query.group
    } else if (this.$route.query.teacher) {
      this.filter.type = 'teacher'
      this.filter.value = this.$route.query.teacher
    }
    
    if (this.filter.value) {
      this.loadSchedule()
    }
  }
}
</script>

<style scoped>
.schedule-view {
  padding: 20px;
  background: #f8f9fa;
  min-height: 100vh;
}

.schedule-container {
  max-width: 1200px;
  margin: 0 auto;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.schedule-header {
  padding: 20px 30px;
  background: #2c3e50;
  color: white;
}

.schedule-header h1 {
  margin: 0;
  font-size: 1.8rem;
  display: flex;
  align-items: center;
  gap: 15px;
}

.filter-section {
  padding: 20px;
  background: #f8f9fa;
  border-bottom: 1px solid #e0e0e0;
}

.schedule-content {
  padding: 25px;
}

.loading-state, .error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  color: #7f8c8d;
  text-align: center;
}

.loading-state p, .error-state p {
  margin-top: 15px;
  font-size: 1.1rem;
}

.error-state {
  color: #e74c3c;
}

.retry-btn {
  margin-top: 20px;
  padding: 10px 20px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background 0.3s;
}

.retry-btn:hover {
  background: #2980b9;
}
</style>