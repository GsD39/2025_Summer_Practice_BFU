<template>
  <div class="schedule-table">
    <div class="week-view">
      <div class="week-header">
        <div class="header-cell time-header">{{$t('schedule.schedule_table.time')}}</div>
        <div v-for="day in $t('schedule.days').values()" :key="day" class="header-cell">{{ day }}</div>
      </div>
      
      <div class="week-body">
        <div v-for="timeSlot in timeSlots" :key="timeSlot" class="time-row">
          <div class="time-cell">{{ timeSlot }}</div>
          <div v-for="day in $t('schedule.days').values()" :key="`${day}-${timeSlot}`" class="day-cell">
            <ScheduleItem 
              :lecture="findLecture(day, timeSlot)" 
            />
          </div>
        </div>
      </div>
    </div>
    
    <div v-if="schedule.length === 0" class="empty-schedule">
      <font-awesome-icon icon="fa-calendar-times" size="2x" />
      <p>{{$t('schedule.schedule_table.no_schedule_found')}}</p>
    </div>
  </div>
</template>

<script>
import ScheduleItem from './ScheduleItem.vue'

export default {
  components: { ScheduleItem },
  props: {
    schedule: Array
  },
  data() {
    return {
      timeSlots: [
        '08:30-10:00',
        '10:10-11:40',
        '11:50-13:20',
        '13:50-15:20',
        '15:30-17:00',
        '17:10-18:40',
      ]
    }
  },
  methods: {
    findLecture(day, timeSlot) {
      return this.schedule.find(lecture => 
        lecture.day === day && lecture.time === timeSlot
      );
    }
  }
}
</script>

<style scoped>
.schedule-table {
  margin-top: 20px;
  overflow-x: auto;
}

.week-view {
  display: flex;
  flex-direction: column;
  min-width: 800px;
}

.week-header, .time-row {
  display: flex;
}

.header-cell, .time-cell, .day-cell {
  flex: 1;
  min-width: 150px;
  padding: 12px 15px;
  border: 1px solid #e0e0e0;
}

.week-header {
  background-color: #2c3e50;
  color: white;
  font-weight: bold;
}

.header-cell {
  text-align: center;
}

.time-header {
  background-color: #2c3e50;
  border-right: 1px solid #3a516e;
}

.time-cell {
  background-color: #f8f9fa;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
}

.day-cell {
  min-height: 100px;
  background-color: #fff;
}

.empty-schedule {
  text-align: center;
  padding: 40px;
  color: #7f8c8d;
}

.empty-schedule svg {
  margin-bottom: 15px;
  color: #bdc3c7;
}
</style>