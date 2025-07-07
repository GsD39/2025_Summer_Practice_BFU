<template>
  <div class="user-management">
    <div class="header">
      <h2>User Management</h2>
      <div class="actions">
        <button class="add-btn" @click="showCreateForm = true">
          <font-awesome-icon icon="fa-plus" /> Add User
        </button>
        <button class="batch-btn" @click="showBatchForm = true">
          <font-awesome-icon icon="fa-users" /> Batch Create
        </button>
      </div>
    </div>

    <div class="search-bar">
      <input 
        type="text" 
        v-model="searchQuery" 
        placeholder="Search by email..." 
        @input="filterUsers"
      >
      <font-awesome-icon icon="fa-search" />
    </div>

    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in filteredUsers" :key="user.id">
            <td>{{ user.id }}</td>
            <td>{{ user.email }}</td>
            <td>
              <select v-model="user.role" @change="updateUserRole(user)">
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="admin">Admin</option>
              </select>
            </td>
            <td>
              <label class="switch">
                <input 
                  type="checkbox" 
                  :checked="user.is_active" 
                  @change="toggleUserStatus(user)"
                >
                <span class="slider"></span>
                <span class="status-text">
                  {{ user.is_active ? 'Active' : 'Inactive' }}
                </span>
              </label>
            </td>
            <td>
              <button @click="confirmDelete(user)" class="delete-btn">
                <font-awesome-icon icon="fa-trash" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      
      <div v-if="filteredUsers.length === 0" class="empty-state">
        <font-awesome-icon icon="fa-user-slash" />
        <p>No users found</p>
      </div>
    </div>

    <!-- Create User Modal -->
    <div v-if="showCreateForm" class="modal-overlay">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Create New User</h3>
          <button @click="closeCreateForm">
            <font-awesome-icon icon="fa-times" />
          </button>
        </div>
        
        <form @submit.prevent="submitCreateUser">
          <div class="form-group">
            <label>Email *</label>
            <input v-model="newUser.email" type="email" required>
          </div>
          
          <div class="form-group">
            <label>Password *</label>
            <div class="password-input">
              <input 
                v-model="newUser.password" 
                :type="showPassword ? 'text' : 'password'" 
                required
              >
              <button type="button" class="toggle-password" @click="showPassword = !showPassword">
                <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'" />
              </button>
            </div>
          </div>
          
          <div class="form-group">
            <label>Role *</label>
            <select v-model="newUser.role" required>
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          
          <div class="form-actions">
            <button type="button" @click="closeCreateForm">Cancel</button>
            <button type="submit" :disabled="isCreating">
              {{ isCreating ? 'Creating...' : 'Create User' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Batch Create Modal -->
    <div v-if="showBatchForm" class="modal-overlay">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Batch Create Users</h3>
          <button @click="closeBatchForm">
            <font-awesome-icon icon="fa-times" />
          </button>
        </div>
        
        <div class="modal-body">
          <div class="instructions">
            <p>Enter user data in JSON format:</p>
            <pre>[
  {
    "email": "user1@example.com",
    "password": "Pass123!",
    "role": "student"
  },
  {
    "email": "user2@example.com",
    "password": "Pass456!",
    "role": "teacher"
  }
]</pre>
          </div>
          
          <textarea 
            v-model="batchUsersJson" 
            placeholder="Paste JSON array of users..."
            class="json-input"
          ></textarea>
          
          <div v-if="batchError" class="error-message">
            <font-awesome-icon icon="fa-exclamation-circle" /> {{ batchError }}
          </div>
        </div>
        
        <div class="modal-actions">
          <button @click="closeBatchForm">Cancel</button>
          <button @click="submitCreateUsersBatch" :disabled="isBatchCreating">
            {{ isBatchCreating ? 'Creating...' : 'Create Users' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="userToDelete" class="modal-overlay">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Confirm Deletion</h3>
        </div>
        
        <div class="modal-body">
          <p>Are you sure you want to delete user <strong>{{ userToDelete.email }}</strong>?</p>
          <p class="warning">This action cannot be undone.</p>
        </div>
        
        <div class="modal-actions">
          <button @click="userToDelete = null">Cancel</button>
          <button @click="submitDeleteUser" class="delete-btn" :disabled="isDeleting">
            <font-awesome-icon icon="fa-trash" /> 
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  name: 'UserManagement',
  data() {
    return {
      showCreateForm: false,
      showBatchForm: false,
      userToDelete: null,
      searchQuery: '',
      filteredUsers: [],
      newUser: {
        email: '',
        password: '',
        role: 'student'
      },
      batchUsersJson: '',
      showPassword: false,
      isCreating: false,
      isBatchCreating: false,
      isDeleting: false,
      batchError: ''
    }
  },
  computed: {
    ...mapState('admin', ['users', 'isLoading', 'error'])
  },
  watch: {
    users: {
      immediate: true,
      handler(newUsers) {
        this.filteredUsers = [...newUsers]
      }
    }
  },
  created() {
    this.fetchUsers()
  },
  methods: {
    ...mapActions('admin', ['fetchUsers', 'createUser', 'updateUser', 'deleteUser', 'createUsersBatch']),
    
    filterUsers() {
      if (!this.searchQuery) {
        this.filteredUsers = [...this.users]
        return
      }
      
      const query = this.searchQuery.toLowerCase()
      this.filteredUsers = this.users.filter(user => 
        user.email.toLowerCase().includes(query))
    },
    
    updateUserRole(user) {
      this.updateUser({
        id: user.id,
        role: user.role
      })
      this.fetchUsers();
    },
    
    toggleUserStatus(user) {
      this.updateUser({
        id: user.id,
        is_active: !user.is_active
      })
      this.fetchUsers();
    },
    
    confirmDelete(user) {
      this.userToDelete = user
    },
    
    async submitDeleteUser() {
      if (!this.userToDelete) return
      
      this.isDeleting = true
      try {
        await this.deleteUser(this.userToDelete.id)
        this.userToDelete = null
      } catch (error) {
        console.error('Delete failed:', error)
      } finally {
        this.isDeleting = false
      }
      await this.fetchUsers();
    },
    
    closeCreateForm() {
      this.showCreateForm = false
      this.newUser = {
        email: '',
        password: '',
        role: 'student'
      }
      this.showPassword = false
    },
    
    async submitCreateUser() {
      this.isCreating = true
      try {
        await this.createUser({...this.newUser})
        this.closeCreateForm()
      } catch (error) {
        console.error('Create failed:', error)
      } finally {
        this.isCreating = false
      }
      await this.fetchUsers();
    },
    
    closeBatchForm() {
      this.showBatchForm = false
      this.batchUsersJson = ''
      this.batchError = ''
    },
    
    async submitCreateUsersBatch() {
      this.batchError = ''
      this.isBatchCreating = true
      
      try {
        const users = JSON.parse(this.batchUsersJson)
        if (!Array.isArray(users)) {
          throw new Error('Input must be a JSON array')
        }
        
        if (users.length === 0) {
          throw new Error('No users provided')
        }
        
        for (const user of users) {
          if (!user.email || !user.password || !user.role) {
            throw new Error('Each user must have email, password, and role')
          }
          
          if (!['student', 'teacher', 'admin'].includes(user.role)) {
            throw new Error(`Invalid role: ${user.role}`)
          }
        }
        
        await this.createUsersBatch(users)
        this.closeBatchForm()
        await this.fetchUsers();
        
      } catch (error) {
        this.batchError = error.message
      } finally {
        this.isBatchCreating = false
      }
    }
  }
}
</script>

<style scoped>
.user-management {
  padding: 20px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

.header h2 {
  margin: 0;
  color: #2c3e50;
}

.actions {
  display: flex;
  gap: 10px;
}

.add-btn, .batch-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s;
}

.add-btn {
  background: #3498db;
  color: white;
}

.add-btn:hover {
  background: #2980b9;
}

.batch-btn {
  background: #2ecc71;
  color: white;
}

.batch-btn:hover {
  background: #27ae60;
}

.search-bar {
  position: relative;
  margin-bottom: 20px;
  max-width: 300px;
}

.search-bar input {
  width: 100%;
  padding: 10px 15px 10px 35px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.search-bar .fa-search {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #7f8c8d;
}

.table-container {
  overflow-x: auto;
  border-radius: 8px;
  border: 1px solid #eee;
  min-height: 300px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 12px 15px;
  text-align: left;
}

th {
  background-color: #f8f9fa;
  font-weight: 600;
  color: #2c3e50;
  border-bottom: 2px solid #eee;
}

tr {
  border-bottom: 1px solid #eee;
}

tr:hover {
  background-color: #f8f9fa;
}

select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  width: 100%;
}

.switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
  border-radius: 24px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #28a745;
}

input:checked + .slider:before {
  transform: translateX(26px);
}

.status-text {
  margin-left: 60px;
  font-size: 0.9rem;
  color: #555;
}

.delete-btn {
  border: none;
  color: #e74c3c;
  cursor: pointer;
  font-size: 1.2rem;
  transition: color 0.3s;
}

.delete-btn:hover {
  color: #c0392b;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  color: #7f8c8d;
}

.empty-state i {
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

.modal-content {
  background: white;
  width: 90%;
  max-width: 500px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 5px 25px rgba(0, 0, 0, 0.2);
}

.modal-header {
  padding: 15px 20px;
  background: #2c3e50;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.2rem;
}

.modal-header button {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 1.2rem;
}

.modal-body {
  padding: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
  color: #2c3e50;
}

.form-group input, 
.form-group select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.password-input {
  position: relative;
}

.toggle-password {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #7f8c8d;
  cursor: pointer;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding-top: 15px;
  border-top: 1px solid #eee;
  margin-top: 15px;
}

.form-actions button {
  padding: 8px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
}

.form-actions button:first-child {
  background: #ecf0f1;
  color: #7f8c8d;
}

.form-actions button:last-child {
  background: #3498db;
  color: white;
}

.instructions {
  margin-bottom: 15px;
}

.instructions pre {
  background: #f8f9fa;
  padding: 10px;
  border-radius: 4px;
  font-size: 0.85rem;
  overflow-x: auto;
}

.json-input {
  width: 100%;
  min-height: 200px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: monospace;
  font-size: 0.9rem;
}

.error-message {
  background: #fce4e2;
  color: #e74c3c;
  padding: 10px;
  border-radius: 4px;
  margin-top: 15px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.warning {
  color: #e74c3c;
  font-weight: 500;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 15px 20px;
  border-top: 1px solid #eee;
}

.modal-actions button {
  padding: 8px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
}

.modal-actions button:first-child {
  background: #ecf0f1;
  color: #7f8c8d;
}

.modal-actions .delete-btn {
  background: #e74c3c;
  color: white;
}

/* Responsive design */
@media (max-width: 768px) {
  .header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
  
  .actions {
    width: 100%;
    flex-direction: column;
  }
  
  .add-btn, .batch-btn {
    width: 100%;
    justify-content: center;
  }
  
  th, td {
    padding: 8px 10px;
    font-size: 0.9rem;
  }
}
</style>