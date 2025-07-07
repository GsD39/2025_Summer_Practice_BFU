<template>
    <div class="modal-overlay">
      <div class="lecture-form">
        <div class="header">
          <h3>Create New Lecture</h3>
          <button @click="$emit('close')">
            <font-awesome-icon icon=" fa-times" />
          </button>
        </div>
        
        <form @submit.prevent="handleSubmit">
          <div class="form-row">
            <div class="form-group">
              <label>Group *</label>
              <input v-model="lectureData.group" required>
            </div>
            
            <div class="form-group">
              <label>Subject *</label>
              <input v-model="lectureData.subject" required>
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label>Teacher *</label>
              <input v-model="lectureData.teacher" required>
            </div>
            
            <div class="form-group">
              <label>Room *</label>
              <input v-model="lectureData.room" required>
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label>Day *</label>
              <select v-model="lectureData.day" required>
                <option value="Monday">Monday</option>
                <option value="Tuesday">Tuesday</option>
                <option value="Wednesday">Wednesday</option>
                <option value="Thursday">Thursday</option>
                <option value="Friday">Friday</option>
                <option value="Saturday">Saturday</option>
                <option value="Sunday">Sunday</option>
              </select>
            </div>
            
            <div class="form-group">
              <label>Week Type *</label>
              <select v-model="lectureData.week_type" required>
                <option value="lower">Lower Week</option>
                <option value="upper">Upper Week</option>
                <option value="both">Both Weeks</option>
              </select>
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label>Start Time *</label>
              <input type="time" v-model="lectureData.start_time" required>
            </div>
            
            <div class="form-group">
              <label>End Time *</label>
              <input type="time" v-model="lectureData.end_time" required>
            </div>
          </div>
          
          <div class="form-actions">
            <button type="button" @click="$emit('close')">Cancel</button>
            <button type="submit">Create Lecture</button>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        lectureData: {
          group: '',
          subject: '',
          teacher: '',
          room: '',
          day: 'Monday',
          start_time: '09:00',
          end_time: '10:30',
          week_type: 'lower'
        }
      }
    },
    methods: {
      handleSubmit() {
        this.$emit('save', this.lectureData)
      }
    }
  }
  </script>
  
  <style scoped>
  </style>