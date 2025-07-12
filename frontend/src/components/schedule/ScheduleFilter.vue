<template>
  <div class="schedule-filter">
    <div class="filter-header">
      <font-awesome-icon icon="fa-filter" />
      <h3>{{$t('schedule.schedule_filter.title')}}</h3>
    </div>
    
    <div class="filter-controls">
      <div class="filter-group">
        <div class="filter-options">
          <label :class="{ active: filterType === 'group' }">
            <input 
              type="radio" 
              v-model="filterType" 
              value="group"
              @change="handleFilterChange"
              hidden
            > 
            <span class="radio-custom"></span>
            <span class="label-text">{{$t('schedule.schedule_filter.by_group')}}</span>
          </label>
          
          <label :class="{ active: filterType === 'teacher' }">
            <input 
              type="radio" 
              v-model="filterType" 
              value="teacher"
              @change="handleFilterChange"
              hidden
            > 
            <span class="radio-custom"></span>
            <span class="label-text">{{$t('schedule.schedule_filter.by_teacher')}}</span>
          </label>
        </div>
        
        <div class="filter-select">
          <div class="select-wrapper">
            <font-awesome-icon icon="fa-chevron-down" class="select-icon" />
            <select 
              v-if="filterType === 'group'" 
              v-model="selectedGroup"
              @change="handleFilterChange"
              class="styled-select"
            >
              <option value="">{{$t('schedule.schedule_filter.select_group')}}:</option>
              <option v-for="(group, index) in groups" :key="index" :value="group">
                {{ group }}
              </option>
            </select>
            
            <select 
              v-else 
              v-model="selectedTeacher"
              @change="handleFilterChange"
              class="styled-select"
            >
              <option value="">{{$t('schedule.schedule_filter.select_teacher')}}:</option>
              <option v-for="(teacher, index) in teachers" :key="index" :value="teacher">
                {{ teacher }}
              </option>
            </select>
          </div>
        </div>
      </div>
      
      <div class="date-filter">
        <label>{{$t('schedule.schedule_filter.select_date')}}:</label>
        <div class="date-input-wrapper">
          <font-awesome-icon icon="fa-calendar" class="date-icon" />
          <input 
            type="date" 
            v-model="selectedDate"
            @change="handleFilterChange"
            class="styled-date"
          >
        </div>
      </div>
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

<style scoped>
.schedule-filter {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  padding: 20px;
  margin-bottom: 25px;
  border: 1px solid #e0e0e0;
}

.filter-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

.filter-header h3 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.2rem;
}

.filter-header i {
  color: #3498db;
  font-size: 1.1rem;
}

.filter-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 25px;
}

.filter-group {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 300px;
}

.filter-options {
  display: flex;
  gap: 25px;
  margin-bottom: 15px;
}

label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  position: relative;
  padding-left: 28px;
  color: #7f8c8d;
  transition: color 0.3s;
}

label.active {
  color: #2c3e50;
  font-weight: 500;
}

.radio-custom {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 18px;
  height: 18px;
  border: 2px solid #bdc3c7;
  border-radius: 50%;
  transition: all 0.3s;
}

label.active .radio-custom {
  border-color: #3498db;
  background: #3498db;
  box-shadow: 0 0 0 4px white inset;
}

.filter-select {
  position: relative;
}

.select-wrapper {
  position: relative;
}

.styled-select {
  width: 100%;
  padding: 12px 15px 12px 40px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: white;
  appearance: none;
  font-size: 1rem;
  color: #2c3e50;
  transition: border-color 0.3s;
  cursor: pointer;
}

.styled-select:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
}

.select-icon {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #7f8c8d;
  pointer-events: none;
}

.date-filter {
  display: flex;
  flex: 0.5;
  flex-direction: column;
  min-width: 200px;
}

.date-filter label {
  margin-bottom: 8px;
  padding-left: 0;
  color: #2c3e50;
  font-weight: 500;
}

.date-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.styled-date {
  width: 100%;
  padding: 12px 15px 12px 40px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  color: #2c3e50;
  transition: border-color 0.3s;
}

.styled-date:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
}

.date-icon {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #7f8c8d;
}

/* Responsive design */
@media (max-width: 768px) {
  .filter-controls {
    flex-direction: column;
    gap: 20px;
  }
  
  .filter-group {
    min-width: 100%;
  }
  
  .filter-options {
    gap: 15px;
  }
}
</style>