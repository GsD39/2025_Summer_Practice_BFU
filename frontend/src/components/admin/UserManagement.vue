<template>
    <div class="user-management">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td>{{ user.name }}</td>
            <td>{{ user.email }}</td>
            <td>
              <select v-model="user.role" @change="updateUserRole(user)">
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="admin">Admin</option>
              </select>
            </td>
            <td>
              <button @click="deleteUser(user.id)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script>
  import { mapActions, mapState } from 'vuex'
  
  export default {
    computed: {
      ...mapState('admin', ['users'])
    },
    methods: {
      ...mapActions('admin', ['fetchUsers', 'updateUser', 'deleteUser']),
      updateUserRole(user) {
        this.updateUser({
          id: user.id,
          role: user.role
        })
      }
    },
    created() {
      this.fetchUsers()
    }
  }
  </script>