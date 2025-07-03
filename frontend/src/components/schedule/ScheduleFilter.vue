<template>
    <div class="schedule-filter">
      <div class="filter-controls">
        <label>
          <input type="radio" v-model="filterType" value="group"> By Group
        </label>
        <label>
          <input type="radio" v-model="filterType" value="teacher"> By Teacher
        </label>
        
        <select v-model="filterValue" v-if="filterType === 'group'">
          <option value="">All Groups</option>
          <option v-for="group in groups" :key="group" :value="group">{{ group }}</option>
        </select>
        
        <select v-model="filterValue" v-else>
          <option value="">All Teachers</option>
          <option v-for="teacher in teachers" :key="teacher" :value="teacher">{{ teacher }}</option>
        </select>
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
        filterValue: ''
      }
    },
    watch: {
      filterType() {
        this.filterValue = ''
        this.emitFilter()
      },
      filterValue() {
        this.emitFilter()
      }
    },
    methods: {
      emitFilter() {
        this.$emit('filter-change', {
          type: this.filterType,
          value: this.filterValue
        })
      }
    }
  }
  </script>