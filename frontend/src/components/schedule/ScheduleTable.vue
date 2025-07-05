<template>
    <div class="schedule-table">
      <table>
        <thead>
          <tr>
            <th>Time</th>
            <th>Monday</th>
            <th>Tuesday</th>
            <th>Wednesday</th>
            <th>Thursday</th>
            <th>Friday</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="timeSlot in timeSlots" :key="timeSlot">
            <td>{{ timeSlot }}</td>
            <td v-for="day in days" :key="day">
              <ScheduleItem 
                :lecture="findLecture(day, timeSlot)" 
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
        days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        timeSlots: [
          '9:00-10:30',
          '10:45-12:15',
          '13:00-14:30',
          '14:45-16:15',
          '16:30-18:00'
        ]
      }
    },
    methods: {
      findLecture(day, timeSlot) {
        return this.schedule.find(lecture => 
          lecture.day === day && lecture.time === timeSlot
        )
      }
    }
  }
  </script>
  
  <style scoped>
  table {
    width: 100%;
    border-collapse: collapse;
  }
  th, td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: center;
  }
  th {
    background-color: #f2f2f2;
  }
  </style>