<template>
  <div class="schedule-view">
    <h1>University Schedule</h1>
    <ScheduleFilter @filter-change="handleFilterChange" />
    <ScheduleTable :schedule="filteredSchedule" />
  </div>
</template>

<script>
import ScheduleFilter from '@/components/schedule/ScheduleFilter.vue'
import ScheduleTable from '@/components/schedule/ScheduleTable.vue'
import { mapActions, mapState } from 'vuex'

export default {
  components: { ScheduleFilter, ScheduleTable },
  data() {
    return {
      filter: {
        type: 'group',
        value: ''
      }
    }
  },
  computed: {
    ...mapState('schedule', ['schedule']),
    filteredSchedule() {
      if (!this.filter.value) return this.schedule
      
      return this.schedule.filter(item => {
        if (this.filter.type === 'group') {
          return item.groups.includes(this.filter.value)
        } else {
          return item.teacher === this.filter.value
        }
      })
    }
  },
  methods: {
    ...mapActions('schedule', ['fetchSchedule']),
    handleFilterChange(filter) {
      this.filter = filter
    }
  },
  created() {
    this.fetchSchedule()
  }
}
</script>