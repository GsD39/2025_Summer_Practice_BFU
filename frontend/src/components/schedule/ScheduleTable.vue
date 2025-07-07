<template>
  <div class="schedule-table">
    <table>
      <thead>
        <tr>
          <th>Time</th>
          <th v-for="day in days" :key="day">{{ day }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="timeSlot in timeSlots" :key="timeSlot">
          <td>{{ formatTimeSlot(timeSlot) }}</td>
          <td v-for="day in days" :key="`${day}-${timeSlot}`">
            <ScheduleItem 
              :lecture="getLectureForSlot(day, timeSlot)" 
            />
          </td>
        </tr>
      </tbody>
    </table>
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
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      timeSlots: [
        '09:00-10:30',
        '10:45-12:15',
        '13:00-14:30',
        '14:45-16:15',
        '16:30-18:00',
        '18:15-19:45'
      ]
    }
  },
  methods: {
    getLectureForSlot(day, timeSlot) {
      const [startTime, endTime] = timeSlot.split('-');
      return this.schedule.find(lecture => 
        lecture.day.toLowerCase() === day.toLowerCase() &&
        lecture.start_time === startTime &&
        lecture.end_time === endTime
      );
    },
    formatTimeSlot(timeSlot) {
      const [start, end] = timeSlot.split('-');
      return `${this.formatTime(start)}-${this.formatTime(end)}`;
    },
    formatTime(time) {
      const [hours, minutes] = time.split(':');
      const hour = parseInt(hours, 10);
      return hour > 12 ? `${hour - 12}:${minutes} PM` : `${hour}:${minutes} AM`;
    }
  }
}
</script>

<style scoped>
.schedule-table {
  overflow-x: auto;
  margin-top: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
  min-width: 800px;
}

th, td {
  border: 1px solid #e0e0e0;
  padding: 12px 15px;
  text-align: center;
}

th {
  background-color: #2c3e50;
  color: white;
  font-weight: 600;
}

tr:nth-child(even) {
  background-color: #f8f9fa;
}

td:first-child {
  font-weight: 500;
  background-color: #f1f5f9;
}
</style>