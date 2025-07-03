<template>
  <div class="schedule-item" v-if="lecture">
    <div class="lecture-header">
      <span class="course-code">{{ lecture.course.code }}</span>
      <span class="room">{{ lecture.room }}</span>
    </div>
    <div class="course-name">{{ lecture.course.name }}</div>
    <div class="lecture-footer">
      <span class="teacher">{{ lecture.teacher }}</span>
      <span class="groups">{{ formatGroups(lecture.groups) }}</span>
    </div>
  </div>
  <div v-else class="empty-slot"></div>
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
    formatGroups(groups) {
      if (!groups) return ''
      if (groups.length <= 2) return groups.join(', ')
      
      // For more than 2 groups, show first group + count of others
      return `${groups[0]} +${groups.length - 1}`
    }
  }
}
</script>

<style scoped>
.schedule-item {
  background-color: #e3f2fd;
  border-left: 3px solid #2196f3;
  border-radius: 4px;
  padding: 8px;
  margin: 4px 0;
  min-height: 70px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.schedule-item:hover {
  background-color: #bbdefb;
  transform: translateY(-2px);
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.empty-slot {
  min-height: 70px;
}

.lecture-header {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  margin-bottom: 5px;
}

.course-code {
  font-weight: bold;
  color: #1565c0;
}

.room {
  background-color: #bbdefb;
  color: #0d47a1;
  border-radius: 12px;
  padding: 1px 8px;
  font-size: 0.75rem;
  font-weight: bold;
}

.course-name {
  font-weight: 500;
  font-size: 0.9rem;
  margin-bottom: 5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.lecture-footer {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: #555;
}

.teacher {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 70%;
}

.groups {
  font-style: italic;
  background-color: #e8f5e9;
  padding: 0 5px;
  border-radius: 3px;
  color: #2e7d32;
}
</style>