<template>
    <div class="schedule-editor">
      <div class="editor-header">
        <h2>Schedule manager</h2>
        <button class="add-lecture-btn" @click="openLectureForm(null)">
          <font-awesome-icon icon="fa-plus" />Add new lecture
        </button>
      </div>
  
      <div class="filters">
        <div class="filter-group">
          <label>Filter by day:</label>
          <input v-model="lectures.filterDay" @change="filterSchedule" />
          <datalist>
            <option value="">All days</option>
            <option v-for="day in days" :key="day" :value="day">{{ day }}</option>
          </datalist>
        </div>
        
        <div class="filter-group">
          <label>Filter by teacher:</label>
          <input v-model="lectures.filterTeacher" @change="filterSchedule" />
          <datalist>
            <option value="">All teachers</option>
            <option v-for="teacher in teachers" :key="teacher" :value="teacher">{{ teacher }}</option>
          </datalist>
        </div>
        
        <div class="filter-group">
          <label>Filter by groups:</label>
          <input v-model="lectures.filterGroup" @change="filterSchedule" />
          <datalist>
            <option value="">All groups</option>
            <option v-for="group in groups" :key="group" :value="group"> {{ group }}</option>
          </datalist>
        </div>
      </div>
  
      <div class="schedule-list">
        <div class="list-header">
          <div class="header-item">Time</div>
          <div class="header-item">Day</div>
          <div class="header-item">Group</div>
          <div class="header-item">Subject</div>
          <div class="header-item">Teacher</div>
          <div class="header-item">Room</div>
          <div class="header-item actions">Actions</div>
        </div>
        
        <div class="list-body">
          <div v-for="lecture in filteredLectures" :key="lecture.id" class="list-row">
            <div class="list-item time">{{ lecture.time }}</div>
            <div class="list-item day">{{ lecture.day }}</div>
            <div class="list-item group">
              <span class="group-name">{{ lecture.group }}</span>
            </div>
            <div class="list-item subject">{{ lecture.subject }}</div>
            <div class="list-item teacher">{{ lecture.teacher }}</div>
            <div class="list-item room">{{ lecture.room }}</div>
            <div class="list-item groups">
              <span v-for="group in lecture.groups" :key="group" class="group-tag">{{ group }}</span>
            </div>
            <div class="list-item actions">
              <button class="edit-btn" @click="openLectureForm(lecture)">
                <font-awesome-icon icon=" fa-edit" />
              </button>
              <button class="delete-btn" @click="confirmDelete(lecture)">
                <font-awesome-icon icon=" fa-trash" />
              </button>
            </div>
          </div>
          
          <div v-if="filteredLectures.length === 0" class="empty-list">
            <font-awesome-icon icon=" fa-calendar-times" />
            <p>No lectures found</p>
          </div>
        </div>
      </div>

      <!-- Lecture Form Modal -->
      <div v-if="newLecture.showLectureForm" class="modal-overlay">
        <div class="lecture-form-modal">
          <div class="modal-header">
            <h3>{{ editingLecture ? 'Edit Lecture' : 'Add New Lecture' }}</h3>
            <button class="close-btn" @click="closeLectureForm">
              <font-awesome-icon icon=" fa-times" />
            </button>
          </div>
          
          <form @submit.prevent="saveLecture" class="lecture-form">
            <div class="form-row">
              <div class="form-group">
                <label>Group *</label>
                <input v-model="newLecture.group" required />
                <datalist>
                  <option v-for="group in groups" :key="group" :value="group">
                    {{ group.code }} - {{ group.name }}
                  </option>
                </datalist>
              </div>
              
              <div class="form-group">
                <label>Teacher *</label>
                <input v-model="newLecture.teacher" required>
                <datalist>
                  <option v-for="teacher in teachers" :key="teacher" :value="teacher">
                    {{ teacher }}
                  </option>
                </datalist>
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label>Day *</label>
                <select v-model="newLecture.day" required>
                  <option v-for="day in days" :key="day" :value="day">
                    {{ day }}
                  </option>
                </select>
              </div>
              
              <div class="form-group">
                <label>Time *</label>
                <input v-model="newLecture.time" required>
                <datalist>
                  <option v-for="timeSlot in timeSlots" :key="timeSlot" :value="timeSlot">
                    {{ timeSlot }}
                  </option>
                </datalist>
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label>Room *</label>
                <input type="text" v-model="newLecture.room" required>
              </div>

              <div class="form-group">
                <label>Subject *</label>
                <input v-model="newLecture.subject" required>
                <datalist>
                  <option v-for="subject in subjects" :key="subject" :value="subject">
                    {{ subject }}
                  </option>
                </datalist>
              </div>
            </div>
            
            <div class="form-actions">
              <button type="button" class="cancel-btn" @click="closeLectureForm">
                Close
              </button>
              <button type="submit" class="save-btn">
                {{ editingLecture ? 'Update Lecture' : 'Add Lecture' }}
              </button>
            </div>
          </form>
        </div>
      </div>
  
      <!-- Delete Confirmation Modal -->
      <div v-if="showDeleteConfirmation" class="modal-overlay">
        <div class="confirmation-modal">
          <div class="modal-header">
            <h3>Confirm Deletion</h3>
          </div>
          
          <div class="modal-body">
            <p>Are you sure you want to delete this lecture?</p>
            <div class="lecture-preview">
              <div><strong>Group:</strong> {{ lectureToDelete.group.code }} - {{ lectureToDelete.group.name }}</div>
              <div><strong>Day/Time:</strong> {{ lectureToDelete.day }}, {{ lectureToDelete.time }}</div>
              <div><strong>Teacher:</strong> {{ lectureToDelete.teacher }}</div>
              <div><strong>Room:</strong> {{ lectureToDelete.room }}</div>
              <div><strong>Room:</strong> {{ lectureToDelete.subject }}</div>
            </div>
          </div>
          
          <div class="modal-actions">
            <button class="cancel-btn" @click="showDeleteConfirmation = false">
              Close
            </button>
            <button class="delete-btn" @click="submitDeleteLecture">
              Delete lecture
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
<script>
import { mapState, mapActions, mapGetters } from 'vuex';

export default {
  computed: {
    ...mapState('schedule', ['isLoading', 'error', 'lectures']),
    ...mapGetters('schedule', ['groups', 'subjects', 'teachers']),
    
    groups() {
      console.log("Returning groups", this.$store.state.schedule.groups)
      return this.$store.state.schedule.groups;
    },
    teachers() {
      return this.$store.state.schedule.teachers;
    }
  },
  async mounted() {
    await this.fetchAllLectures();
    await this.fetchGroups();
    await this.fetchTeachers();
  },
  watch: {
    lectures: {
      immediate: true,
      handler(newLectures) {
        this.filteredLectures = [...newLectures]
      }
    }
  },
  created() {
    this.fetchAllLectures()
  },
  methods: {
    ...mapActions('schedule', [
      'fetchAllLectures',
      'createLecture',
      'updateLecture',
      'deleteLecture',
      'fetchGroups',
      'fetchTeachers'
    ]),

    async saveLecture() {
      console.log(this.groups)
      const payload = {
        id: this.editingLecture?.id,
        data: {
          group: this.newLecture.group,
          subject: this.newLecture.subject,
          teacher: this.newLecture.teacher,
          room: this.newLecture.room,
          day: this.newLecture.day,
          start_time: this.newLecture.start_time,
          end_time: this.newLecture.end_time,
          week_type: this.newLecture.week_type
        }
      };

      if (this.editingLecture) {
        await this.updateLecture(payload);
      } else {
        console.log(payload)
        await this.createLecture(payload.data);
        this.showLectureForm = false;
        this.filterSchedule();
      }
      this.closeLectureForm();
      await this.fetchAllLectures();
    },

    async filterSchedule() {
      await this.fetchAllLectures(); // TODO
    },

    async confirmDelete() {
      await this.submitDeleteLecture(); // TODO
    },

    async submitDeleteLecture(lecture) {
      await this.deleteLecture(lecture.id);
      this.showDeleteConfirmation = false;
      await this.fetchAllLectures();
    },

    closeLectureForm() {
      this.showLectureForm = false;
    },

    openLectureForm(lecture) {
      if (lecture) {
        this.newLecture = {
          groupId: lecture.groups,
          subject: lecture.subject,
          teacher: lecture.teacher,
          day: lecture.day,
          start_time: lecture.start_time,
          end_time: lecture.end_time,
          week_type: lecture.week_type,
          room: lecture.room
        };
      }
      this.editingLecture = lecture;
      this.showLectureForm = true;
    }
  },

  data() {
    return {
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      newLecture: {
        group: '',
        teacher: '',
        subject: '',
        day: 'Monday',
        start_time: '09:00',
        end_time: '10:30',
        week_type: 'lower',
        room: '',
        filterDay: '',
        filterTeacher: '',
        filterGroup: '',
      },
      showLectureForm: false,
      showDeleteConfirmation: false,
      filteredLectures: [],
    }
  }
}
</script>
  
  <style scoped>
  .schedule-editor {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    background: #f8f9fa;
    border-radius: 10px;
    box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1);
  }
  
  .editor-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 25px;
    padding-bottom: 15px;
    border-bottom: 1px solid #e0e0e0;
  }
  
  h2 {
    color: #2c3e50;
    font-weight: 600;
    margin: 0;
  }
  
  .add-lecture-btn {
    background: #3498db;
    color: white;
    border: none;
    padding: 10px 15px;
    border-radius: 5px;
    cursor: pointer;
    font-weight: 600;
    transition: background 0.3s;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .add-lecture-btn:hover {
    background: #2980b9;
  }
  
  .filters {
    display: flex;
    gap: 20px;
    margin-bottom: 25px;
    flex-wrap: wrap;
  }
  
  .filter-group {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-width: 200px;
  }
  
  label {
    margin-bottom: 5px;
    font-weight: 500;
    color: #2c3e50;
  }
  
  select, input {
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 14px;
  }
  
  .schedule-list {
    background: white;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  .list-header, .list-row {
    display: grid;
    grid-template-columns: 1fr 1fr 2fr 1.5fr 1fr 2fr 100px;
    gap: 10px;
    padding: 15px 20px;
  }
  
  .list-header {
    background: #2c3e50;
    color: white;
    font-weight: 600;
  }
  
  .list-body {
    max-height: 500px;
    overflow-y: auto;
  }
  
  .list-row {
    border-bottom: 1px solid #eee;
    transition: background 0.2s;
  }
  
  .list-row:hover {
    background-color: #f5f9ff;
  }
  
  .list-item {
    display: flex;
    align-items: center;
  }
  
  .actions {
    display: flex;
    gap: 10px;
  }
  
  .edit-btn, .delete-btn {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border: none;
    transition: all 0.2s;
  }
  
  .edit-btn {
    background: #f1c40f;
    color: #2c3e50;
  }
  
  .edit-btn:hover {
    background: #f39c12;
  }
  
  .delete-btn {
    background: #e74c3c;
    color: white;
  }
  
  .delete-btn:hover {
    background: #c0392b;
  }
  
  .group-code {
    font-weight: bold;
    color: #3498db;
    margin-right: 8px;
  }
  
  .group-name {
    color: #555;
  }
  
  .groups {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
  }
  
  .group-tag {
    background: #e8f4fc;
    color: #2980b9;
    padding: 3px 8px;
    border-radius: 12px;
    font-size: 12px;
    display: flex;
    align-items: center;
    gap: 5px;
  }
  
  .group-tag i {
    cursor: pointer;
    font-size: 10px;
  }
  
  .empty-list {
    text-align: center;
    padding: 40px;
    color: #7f8c8d;
  }
  
  .empty-list i {
    font-size: 48px;
    margin-bottom: 15px;
    color: #bdc3c7;
  }
  
  /* Modal styles */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }
  
  .lecture-form-modal, .confirmation-modal {
    background: white;
    width: 90%;
    max-width: 600px;
    border-radius: 10px;
    box-shadow: 0 5px 25px rgba(0, 0, 0, 0.2);
    overflow: hidden;
  }
  
  .modal-header {
    background: #2c3e50;
    color: white;
    padding: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .modal-header h3 {
    margin: 0;
  }
  
  .close-btn {
    background: none;
    border: none;
    color: white;
    font-size: 20px;
    cursor: pointer;
  }
  
  .lecture-form {
    padding: 20px;
  }
  
  .form-row {
    display: flex;
    gap: 20px;
    margin-bottom: 20px;
  }
  
  .form-group {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  
  label {
    margin-bottom: 8px;
  }
  
  input, select {
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 14px;
  }
  
  .groups-selector {
    border: 1px solid #ddd;
    border-radius: 5px;
    padding: 10px;
    min-height: 50px;
  }
  
  .selected-groups {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
    margin-bottom: 10px;
  }
  
  .group-input {
    display: flex;
    gap: 5px;
  }
  
  .group-input input {
    flex: 1;
  }
  
  .add-group-btn {
    background: #2ecc71;
    color: white;
    border: none;
    border-radius: 5px;
    width: 36px;
    cursor: pointer;
  }
  
  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 20px;
  }
  
  .cancel-btn, .save-btn {
    padding: 10px 20px;
    border-radius: 5px;
    border: none;
    cursor: pointer;
    font-weight: 600;
  }
  
  .cancel-btn {
    background: #ecf0f1;
    color: #7f8c8d;
  }
  
  .cancel-btn:hover {
    background: #d5dbdb;
  }
  
  .save-btn {
    background: #2ecc71;
    color: white;
  }
  
  .save-btn:hover {
    background: #27ae60;
  }
  
  .confirmation-modal .modal-body {
    padding: 20px;
  }
  
  .lecture-preview {
    background: #f9f9f9;
    padding: 15px;
    border-radius: 5px;
    margin-top: 15px;
    border-left: 4px solid #e74c3c;
  }
  
  .modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    padding: 15px 20px;
    background: #f8f9fa;
    border-top: 1px solid #eee;
  }
  
  .delete-btn-modal {
    background: #e74c3c;
    color: white;
  }
  
  .delete-btn-modal:hover {
    background: #c0392b;
  }
  </style>