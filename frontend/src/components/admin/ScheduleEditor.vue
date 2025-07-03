<template>
    <div class="schedule-editor">
      <div class="editor-header">
        <h2>Редактор расписания</h2>
        <button class="add-lecture-btn" @click="openLectureForm(null)">
          <i class="fas fa-plus"></i> Добавить новую лекцию
        </button>
      </div>
  
      <div class="filters">
        <div class="filter-group">
          <label>Фильтровать по дню:</label>
          <select v-model="filterDay" @change="filterSchedule">
            <option value="">Все дни</option>
            <option v-for="day in days" :key="day" :value="day">{{ day }}</option>
          </select>
        </div>
        
        <div class="filter-group">
          <label>Фильтровать по преподавателю:</label>
          <select v-model="filterTeacher" @change="filterSchedule">
            <option value="">Все преподаватели</option>
            <option v-for="teacher in teachers" :key="teacher" :value="teacher">{{ teacher }}</option>
          </select>
        </div>
        
        <div class="filter-group">
          <label>Фильтровать по группе:</label>
          <select v-model="filterGroup" @change="filterSchedule">
            <option value="">Все группы</option>
            <option v-for="course in courses" :key="course.id" :value="course.id">
              {{ course.code }} - {{ course.name }}
            </option>
          </select>
        </div>
      </div>
  
      <div class="schedule-list">
        <div class="list-header">
          <div class="header-item">Время</div>
          <div class="header-item">День</div>
          <div class="header-item">Группа</div>
          <div class="header-item">Преподаватель</div>
          <div class="header-item">Аудитория</div>
          <div class="header-item actions">Действия</div>
        </div>
        
        <div class="list-body">
          <div v-for="lecture in filteredLectures" :key="lecture.id" class="list-row">
            <div class="list-item time">{{ lecture.time }}</div>
            <div class="list-item day">{{ lecture.day }}</div>
            <div class="list-item course">
              <span class="course-code">{{ lecture.course.code }}</span>
              <span class="course-name">{{ lecture.course.name }}</span>
            </div>
            <div class="list-item teacher">{{ lecture.teacher }}</div>
            <div class="list-item room">{{ lecture.room }}</div>
            <div class="list-item groups">
              <span v-for="group in lecture.groups" :key="group" class="group-tag">{{ group }}</span>
            </div>
            <div class="list-item actions">
              <button class="edit-btn" @click="openLectureForm(lecture)">
                <i class="fas fa-edit"></i>
              </button>
              <button class="delete-btn" @click="confirmDelete(lecture)">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
          
          <div v-if="filteredLectures.length === 0" class="empty-list">
            <i class="fas fa-calendar-times"></i>
            <p>Ни одна лекция не найдена по заданным фильтрам</p>
          </div>
        </div>
      </div>
  
      <!-- Lecture Form Modal -->
      <div v-if="showLectureForm" class="modal-overlay">
        <div class="lecture-form-modal">
          <div class="modal-header">
            <h3>{{ editingLecture ? 'Edit Lecture' : 'Add New Lecture' }}</h3>
            <button class="close-btn" @click="closeLectureForm">
              <i class="fas fa-times"></i>
            </button>
          </div>
          
          <form @submit.prevent="saveLecture" class="lecture-form">
            <div class="form-row">
              <div class="form-group">
                <label>Группа *</label>
                <select v-model="formData.courseId" required>
                  <option v-for="course in courses" :key="course.id" :value="course.id">
                    {{ course.code }} - {{ course.name }}
                  </option>
                </select>
              </div>
              
              <div class="form-group">
                <label>Преподаватель *</label>
                <select v-model="formData.teacher" required>
                  <option v-for="teacher in teachers" :key="teacher" :value="teacher">
                    {{ teacher }}
                  </option>
                </select>
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label>День *</label>
                <select v-model="formData.day" required>
                  <option v-for="day in days" :key="day" :value="day">
                    {{ day }}
                  </option>
                </select>
              </div>
              
              <div class="form-group">
                <label>Время *</label>
                <select v-model="formData.time" required>
                  <option v-for="timeSlot in timeSlots" :key="timeSlot" :value="timeSlot">
                    {{ timeSlot }}
                  </option>
                </select>
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label>Аудитория *</label>
                <input type="text" v-model="formData.room" required>
              </div>
              
              <!-- <div class="form-group">
                <label>Группа *</label>
                <div class="groups-selector">
                  <div class="selected-groups">
                    <span v-for="group in formData.groups" :key="group" class="group-tag">
                      {{ group }} <i class="fas fa-times" @click="removeGroup(group)"></i>
                    </span>
                  </div>
                  <div class="group-input">
                    <input 
                      type="text" 
                      v-model="newGroup" 
                      placeholder="Add group..."
                      @keydown.enter.prevent="addGroup"
                    >
                    <button type="button" @click="addGroup" class="add-group-btn">
                      <i class="fas fa-plus"></i>
                    </button>
                  </div>
                </div>
              </div> -->
            </div>
            
            <div class="form-actions">
              <button type="button" class="cancel-btn" @click="closeLectureForm">
                Закрыть
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
            <p>Вы уверены, что хотите удалить эту лекцию?</p>
            <div class="lecture-preview">
              <div><strong>Группа:</strong> {{ lectureToDelete.course.code }} - {{ lectureToDelete.course.name }}</div>
              <div><strong>День/Время:</strong> {{ lectureToDelete.day }}, {{ lectureToDelete.time }}</div>
              <div><strong>Преподаватель:</strong> {{ lectureToDelete.teacher }}</div>
              <div><strong>Аудитория:</strong> {{ lectureToDelete.room }}</div>
            </div>
          </div>
          
          <div class="modal-actions">
            <button class="cancel-btn" @click="showDeleteConfirmation = false">
              Закрыть
            </button>
            <button class="delete-btn" @click="deleteLecture">
              Удалить лекцию
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'ScheduleEditor',
    data() {
      return {
        showLectureForm: false,
        showDeleteConfirmation: false,
        editingLecture: null,
        lectureToDelete: null,
        newGroup: '',
        
        filterDay: '',
        filterTeacher: '',
        filterGroup: '',
        filteredLectures: [],
        
        formData: {
          courseId: '',
          teacher: '',
          day: '',
          time: '',
          room: '',
          groups: []
        },
        
        // Sample data - later will come from the backend
        lectures: [
          {
            id: 1,
            course: { id: 101, code: 'CS-101', name: 'Introduction to Computer Science' },
            teacher: 'Dr. Smith',
            day: 'Monday',
            time: '9:00-10:30',
            room: 'A-205',
            groups: ['CS-101-01', 'CS-101-02']
          },
          {
            id: 2,
            course: { id: 102, code: 'MATH-201', name: 'Linear Algebra' },
            teacher: 'Prof. Johnson',
            day: 'Tuesday',
            time: '10:45-12:15',
            room: 'B-107',
            groups: ['MATH-201-01']
          },
          {
            id: 3,
            course: { id: 103, code: 'PHYS-101', name: 'Physics for Engineers' },
            teacher: 'Dr. Williams',
            day: 'Wednesday',
            time: '13:00-14:30',
            room: 'C-304',
            groups: ['ENG-101-01', 'ENG-101-02', 'ENG-101-03']
          },
          {
            id: 4,
            course: { id: 104, code: 'HIST-110', name: 'World History' },
            teacher: 'Dr. Brown',
            day: 'Thursday',
            time: '14:45-16:15',
            room: 'D-112',
            groups: ['HIST-110-01', 'HIST-110-02']
          },
          {
            id: 5,
            course: { id: 105, code: 'ENG-101', name: 'English Composition' },
            teacher: 'Prof. Davis',
            day: 'Friday',
            time: '16:30-18:00',
            room: 'E-201',
            groups: ['ENG-101-01']
          }
        ],
        
        // Static data - later will come from the backend
        days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        timeSlots: ['9:00-10:30', '10:45-12:15', '13:00-14:30', '14:45-16:15', '16:30-18:00'],
        teachers: ['Dr. Smith', 'Prof. Johnson', 'Dr. Williams', 'Dr. Brown', 'Prof. Davis', 'Dr. Wilson'],
        courses: [
          { id: 101, code: 'CS-101', name: 'Introduction to Computer Science' },
          { id: 102, code: 'MATH-201', name: 'Linear Algebra' },
          { id: 103, code: 'PHYS-101', name: 'Physics for Engineers' },
          { id: 104, code: 'HIST-110', name: 'World History' },
          { id: 105, code: 'ENG-101', name: 'English Composition' },
          { id: 106, code: 'CHEM-201', name: 'Organic Chemistry' },
          { id: 107, code: 'BIO-101', name: 'Biology Fundamentals' }
        ]
      };
    },
    mounted() {
      // Initialize filtered list with all lectures
      this.filteredLectures = [...this.lectures];
    },
    methods: {
      openLectureForm(lecture) {
        this.editingLecture = lecture;
        
        if (lecture) {
          // Populate form with existing lecture data
          this.formData = {
            courseId: lecture.course.id,
            teacher: lecture.teacher,
            day: lecture.day,
            time: lecture.time,
            room: lecture.room,
            groups: [...lecture.groups]
          };
        } else {
          // Reset form for new lecture
          this.formData = {
            courseId: '',
            teacher: '',
            day: '',
            time: '',
            room: '',
            groups: []
          };
        }
        
        this.showLectureForm = true;
      },
      
      closeLectureForm() {
        this.showLectureForm = false;
        this.editingLecture = null;
      },
      
      saveLecture() {
        if (this.editingLecture) {
          // Update existing lecture
          const index = this.lectures.findIndex(l => l.id === this.editingLecture.id);
          if (index !== -1) {
            const course = this.courses.find(c => c.id === this.formData.courseId);
            this.lectures[index] = {
              ...this.lectures[index],
              course: course,
              teacher: this.formData.teacher,
              day: this.formData.day,
              time: this.formData.time,
              room: this.formData.room,
              groups: [...this.formData.groups]
            };
          }
        } else {
          // Add new lecture
          const course = this.courses.find(c => c.id === this.formData.courseId);
          const newId = Math.max(...this.lectures.map(l => l.id), 0) + 1;
          
          this.lectures.push({
            id: newId,
            course: course,
            teacher: this.formData.teacher,
            day: this.formData.day,
            time: this.formData.time,
            room: this.formData.room,
            groups: [...this.formData.groups]
          });
        }
        
        // Update filtered list
        this.filterSchedule();
        
        // Close form
        this.closeLectureForm();
      },
      
      confirmDelete(lecture) {
        this.lectureToDelete = lecture;
        this.showDeleteConfirmation = true;
      },
      
      deleteLecture() {
        this.lectures = this.lectures.filter(l => l.id !== this.lectureToDelete.id);
        this.filterSchedule();
        this.showDeleteConfirmation = false;
        this.lectureToDelete = null;
      },
      
      addGroup() {
        if (this.newGroup.trim() && !this.formData.groups.includes(this.newGroup.trim())) {
          this.formData.groups.push(this.newGroup.trim());
          this.newGroup = '';
        }
      },
      
      removeGroup(group) {
        this.formData.groups = this.formData.groups.filter(g => g !== group);
      },
      
      filterSchedule() {
        this.filteredLectures = this.lectures.filter(lecture => {
          const dayMatch = !this.filterDay || lecture.day === this.filterDay;
          const teacherMatch = !this.filterTeacher || lecture.teacher === this.filterTeacher;
          const courseMatch = !this.filterGroup || lecture.course.id.toString() === this.filterGroup.toString();
          
          return dayMatch && teacherMatch && courseMatch;
        });
      }
    }
  };
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
  
  .course-code {
    font-weight: bold;
    color: #3498db;
    margin-right: 8px;
  }
  
  .course-name {
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