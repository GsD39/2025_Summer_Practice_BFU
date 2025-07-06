<template>
  <div class="schedule-filter">
    <div class="filter-controls">
      <label>
        <input 
          type="radio" 
          v-model="filterType" 
          value="group"
          @change="handleFilterChange"
        > By Group
      </label>
      <label>
        <input 
          type="radio" 
          v-model="filterType" 
          value="teacher"
          @change="handleFilterChange"
        > By Teacher
      </label>
      
      <!-- Group selector -->
      <select 
        v-if="filterType === 'group'" 
        v-model="selectedGroup"
        @change="handleFilterChange"
      >
        <option value="">Select Group</option>
        <option v-for="group in groups" :key="group" :value="group">
          {{ group }}
        </option>
      </select>
      
      <!-- Teacher selector -->
      <select 
        v-else 
        v-model="selectedTeacher"
        @change="handleFilterChange"
      >
        <option value="">Select Teacher</option>
        <option v-for="teacher in teachers" :key="teacher" :value="teacher">
          {{ teacher }}
        </option>
      </select>
      
      <!-- Date selector -->
      <input 
        type="date" 
        v-model="selectedDate"
        @change="handleFilterChange"
      >
    </div>
  </div>
</template>

<script>
export default {
  props: {
    groups: Array,
    teachers: Array
  },
  data() {
    return {
      filterType: 'group',
      selectedGroup: '',
      selectedTeacher: '',
      selectedDate: null
    }
  },
  methods: {
    handleFilterChange() {
      let filter = {
        type: this.filterType,
        value: this.filterType === 'group' ? this.selectedGroup : this.selectedTeacher,
        date: this.selectedDate
      }
      this.$emit('filter-change', filter)
    }
  }
}
</script>