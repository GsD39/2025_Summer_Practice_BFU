<template>
  <div class="user-management">
    <div class="header">
      <h2>User Management</h2>
      <button @click="showCreateForm = true">
        <i class="fas fa-plus"></i> Add User
      </button>
    </div>

    <table v-if="users.length">
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
        <tr v-for="user in users" :key="user.id">
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
            </label>
          </td>
          <td>
            <button @click="confirmDelete(user)" class="delete-btn">
              <i class="fas fa-trash"></i>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    
    <p v-else>No users found</p>

    <!-- Create User Modal -->
    <div v-if="showCreateForm" class="modal-overlay">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Create New User</h3>
          <button @click="showCreateForm = false">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <form @submit.prevent="createUser">
          <div class="form-group">
            <label>Email *</label>
            <input v-model="newUser.email" type="email" required>
          </div>
          
          <div class="form-group">
            <label>Password *</label>
            <input v-model="newUser.password" type="password" required>
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
            <button type="button" @click="showCreateForm = false">Cancel</button>
            <button type="submit">Create User</button>
          </div>
        </form>
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
          <p>This action cannot be undone.</p>
        </div>
        
        <div class="modal-actions">
          <button @click="userToDelete = null">Cancel</button>
          <button @click="deleteUser" class="delete-btn">Delete User</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  data() {
    return {
      showCreateForm: false,
      userToDelete: null,
      newUser: {
        email: '',
        password: '',
        role: 'student'
      }
    }
  },
  computed: {
    ...mapState('admin', ['users'])
  },
  created() {
    this.fetchUsers()
  },
  methods: {
    ...mapActions('admin', ['fetchUsers', 'createUser', 'updateUser', 'deleteUser']),
    
    updateUserRole(user) {
      this.updateUser({
        id: user.id,
        role: user.role
      })
    },
    
    toggleUserStatus(user) {
      this.updateUser({
        id: user.id,
        is_active: !user.is_active
      })
    },
    
    confirmDelete(user) {
      this.userToDelete = user
    },
    
    async deleteUser() {
      if (this.userToDelete) {
        await this.deleteUser(this.userToDelete.id)
        this.userToDelete = null
      }
    },
    
    async createUser() {
      try {
        await this.createUser(this.newUser)
        this.showCreateForm = false
        this.newUser = {
          email: '',
          password: '',
          role: 'student'
        }
      } catch (error) {
        alert('Failed to create user: ' + error.message)
      }
    }
  }
}
</script>

<style scoped>
.user-management {
  margin-top: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

th {
  background-color: #f8f9fa;
  font-weight: 600;
}

tr:hover {
  background-color: #f8f9fa;
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

.delete-btn {
  background: none;
  border: none;
  color: #dc3545;
  cursor: pointer;
  font-size: 1.2rem;
}

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
}

.modal-header {
  padding: 15px 20px;
  background: #2c3e50;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-body {
  padding: 20px;
}

.modal-actions {
  padding: 15px 20px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  border-top: 1px solid #eee;
}
</style>