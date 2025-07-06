<template>
  <div class="schedule-view">
    <h1>University Schedule</h1>
    <ScheduleFilter 
      :groups="groups"
      :teachers="teachers"
      @filter-change="handleFilterChange"
    />
    
    <div v-if="isLoading" class="loading">Loading schedule...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    
    <ScheduleTable v-else :schedule="schedule" />
    
    <div v-if="isAdmin" class="admin-controls">
      <button @click="showLectureForm = true">
        <i class="fas fa-plus"></i> Add Lecture
      </button>
    </div>
    
    <LectureForm 
      v-if="showLectureForm"
      @close="showLectureForm = false"
      @save="handleSaveLecture"
    />
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import ScheduleFilter from '@/components/schedule/ScheduleFilter.vue'
import ScheduleTable from '@/components/schedule/ScheduleTable.vue'
import LectureForm from '@/components/admin/LectureForm.vue'

export default {
  components: { ScheduleFilter, ScheduleTable, LectureForm },
  data() {
    return {
      filter: {
        type: 'group',
        value: '',
        date: null
      },
      showLectureForm: false
    }
  },
  computed: {
    ...mapState('schedule', ['schedule', 'groups', 'teachers', 'isLoading', 'error']),
    ...mapGetters('auth', ['isAdmin'])
  },
  methods: {
    ...mapActions('schedule', [
      'fetchGroupSchedule',
      'fetchTeacherSchedule',
      'createLecture'
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
    },
    
    async handleSaveLecture(lectureData) {
      try {
        await this.createLecture(lectureData)
        this.showLectureForm = false
        this.loadSchedule()
      } catch (error) {
        console.error('Failed to save lecture:', error)
      }
    }
  },
  created() {
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