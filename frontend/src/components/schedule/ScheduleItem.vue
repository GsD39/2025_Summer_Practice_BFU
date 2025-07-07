<template>
  <div class="lecture-item" :class="{ 'empty': !lecture }">
    <div v-if="lecture" class="lecture-content">
      <div class="subject">{{ lecture.subject }}</div>
      <div class="details">
        <span class="group">{{ lecture.group }}</span>
        <span class="teacher">{{ lecture.teacher }}</span>
        <span class="room">{{ lecture.room }}</span>
      </div>
      <div v-if="lecture.week_type" class="week-type">
        {{ formatWeekType(lecture.week_type) }}
      </div>
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
        'lower': 'Lower Week',
        'upper': 'Upper Week',
        'both': 'Both Weeks'
      };
      return types[type] || type;
    }
  }
}
</script>

<style scoped>
.lecture-item {
  min-height: 80px;
  padding: 8px;
  border-radius: 4px;
  background-color: #e3f2fd;
  border-left: 3px solid #2196f3;
  transition: all 0.2s ease;
}

.lecture-item.empty {
  background-color: transparent;
  border-left: 3px solid transparent;
}

.lecture-content {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.subject {
  font-weight: 600;
  font-size: 0.9rem;
  margin-bottom: 5px;
  color: #1565c0;
}

.details {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  font-size: 0.8rem;
  color: #555;
}

.details > span {
  background-color: #e1f5fe;
  padding: 2px 6px;
  border-radius: 3px;
}

.week-type {
  margin-top: auto;
  font-size: 0.75rem;
  color: #7e57c2;
  font-style: italic;
}
</style>