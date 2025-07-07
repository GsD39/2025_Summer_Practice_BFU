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
    
    <ScheduleTable v-else :schedule="formattedSchedule" />
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
      // Transform backend data into weekly schedule format
      console.log("schedule:::", this.schedule)
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