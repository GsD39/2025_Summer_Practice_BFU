<template>
  <div v-if="lecture" class="lecture-item">
    <div class="lecture-content">
      <div class="subject">{{ lecture.subject }}</div>
      <div class="group">{{ lecture.group }}</div>
      <div class="details">
        <span class="teacher">{{ lecture.teacher }}</span>
        <span class="room">{{ lecture.room }}</span>
      </div>
      <div class="week-type">{{ formatWeekType(lecture.week_type) }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ScheduleItem',
  props: {
    lecture: {
      type: Object,
      default: null
    }
  },
  methods: {
    formatWeekType(type) {
      const types = {
        'lower': $t('schedule.schedule_item.lower'),
        'upper': $t('schedule.schedule_item.lower'),
        'both': $t('schedule.schedule_item.both')
      };
      return types[type] || type;
    }
  }
}
</script>

<style scoped>
.lecture-item {
  height: 100%;
  padding: 10px;
  background-color: #e3f2fd;
  border-left: 3px solid #2196f3;
  border-radius: 4px;
}

.lecture-content {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.subject {
  font-weight: 600;
  font-size: 0.95rem;
  margin-bottom: 5px;
  color: #1565c0;
}

.group {
  font-size: 0.85rem;
  font-weight: 500;
  margin-bottom: 8px;
}

.details {
  margin-top: auto;
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: #555;
}

.teacher {
  font-weight: 500;
}

.room {
  background-color: #bbdefb;
  color: #0d47a1;
  padding: 2px 6px;
  border-radius: 3px;
  font-weight: bold;
}

.week-type {
  font-size: 0.75rem;
  color: #7e57c2;
  font-style: italic;
  margin-top: 5px;
}
</style>