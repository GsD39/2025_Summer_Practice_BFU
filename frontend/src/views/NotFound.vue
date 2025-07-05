<template>
    <div class="not-found">
      <div class="container">
        <div class="error-code">404</div>
        
        <div class="error-message">
          <h1>Page Not Found</h1>
          <p>Looks like you've taken a wrong turn on your academic journey</p>
        </div>
        
        <div class="university-illustration">
          <div class="building">
            <div class="tower"></div>
            <div class="roof"></div>
            <div class="windows">
              <div v-for="i in 12" :key="i" class="window"></div>
            </div>
            <div class="door"></div>
          </div>
          <div class="path">
            <div class="sign">
              <div class="sign-post"></div>
              <div class="sign-board">
                <span>404</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="suggestions">
          <p>Here are some helpful links to get you back on track:</p>
          <div class="links">
            <router-link to="/schedule" class="btn">
              <i class="fas fa-calendar-alt"></i> Class Schedule
            </router-link>
            <router-link to="/" class="btn">
              <i class="fas fa-home"></i> Home Page
            </router-link>
            <router-link v-if="isAuthenticated" to="/profile" class="btn">
              <i class="fas fa-user"></i> Your Profile
            </router-link>
            <router-link v-else to="/auth" class="btn">
              <i class="fas fa-sign-in-alt"></i> Login
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { mapGetters } from 'vuex'
  
  export default {
    name: 'NotFound',
    computed: {
      ...mapGetters('auth', ['isAuthenticated'])
    }
  }
  </script>
  
  <style scoped>
  .not-found {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: linear-gradient(135deg, #f5f7fa 0%, #e4edf5 100%);
    padding: 20px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }
  
  .container {
    max-width: 800px;
    text-align: center;
    padding: 40px;
    background: white;
    border-radius: 20px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    position: relative;
    overflow: hidden;
  }
  
  .error-code {
    font-size: 120px;
    font-weight: 800;
    color: #e0e7ff;
    line-height: 1;
    margin-bottom: 20px;
  }
  
  .error-message h1 {
    font-size: 2.5rem;
    color: #2c3e50;
    margin-bottom: 15px;
  }
  
  .error-message p {
    font-size: 1.2rem;
    color: #7f8c8d;
    max-width: 500px;
    margin: 0 auto 30px;
  }
  
  /* University Illustration */
  .university-illustration {
    position: relative;
    height: 250px;
    margin: 40px 0;
  }
  
  .building {
    position: absolute;
    left: 50%;
    top: 50px;
    transform: translateX(-50%);
    width: 180px;
    height: 180px;
    background: #3498db;
    border-radius: 10px 10px 0 0;
    z-index: 2;
  }
  
  .roof {
    position: absolute;
    top: -30px;
    left: -20px;
    width: 220px;
    height: 40px;
    background: #e74c3c;
    clip-path: polygon(0% 100%, 5% 0%, 95% 0%, 100% 100%);
  }
  
  .tower {
    position: absolute;
    top: -80px;
    left: 50%;
    transform: translateX(-50%);
    width: 40px;
    height: 80px;
    background: #3498db;
    border-radius: 10px 10px 0 0;
  }
  
  .tower::before {
    content: '';
    position: absolute;
    top: -20px;
    left: -10px;
    width: 60px;
    height: 30px;
    background: #e74c3c;
    clip-path: polygon(0% 100%, 50% 0%, 100% 100%);
  }
  
  .windows {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(4, 1fr);
    gap: 10px;
    padding: 20px;
  }
  
  .window {
    background: #ffd700;
    border-radius: 3px;
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  }
  
  .door {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 40px;
    height: 60px;
    background: #8b4513;
    border-radius: 5px 5px 0 0;
  }
  
  .path {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 30px;
    background: #95a5a6;
  }
  
  .sign {
    position: absolute;
    bottom: 30px;
    right: 20%;
  }
  
  .sign-post {
    width: 8px;
    height: 80px;
    background: #7f8c8d;
    margin: 0 auto;
  }
  
  .sign-board {
    width: 100px;
    height: 50px;
    background: #e74c3c;
    border-radius: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
    transform: rotate(-5deg);
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
  }
  
  .sign-board span {
    font-size: 1.8rem;
    font-weight: bold;
    color: white;
  }
  
  /* Suggestions */
  .suggestions {
    margin-top: 40px;
  }
  
  .suggestions p {
    font-size: 1.1rem;
    color: #7f8c8d;
    margin-bottom: 20px;
  }
  
  .links {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 15px;
  }
  
  .btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 12px 25px;
    background: #3498db;
    color: white;
    border-radius: 50px;
    text-decoration: none;
    font-weight: 600;
    transition: all 0.3s ease;
    box-shadow: 0 4px 10px rgba(52, 152, 219, 0.3);
  }
  
  .btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 15px rgba(52, 152, 219, 0.4);
    background: #2980b9;
  }
  
  .btn i {
    font-size: 1.1rem;
  }
  
  /* Animation */
  @keyframes float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0px); }
  }
  
  .sign {
    animation: float 3s ease-in-out infinite;
  }
  
  /* Responsive design */
  @media (max-width: 600px) {
    .container {
      padding: 30px 20px;
    }
    
    .error-code {
      font-size: 80px;
    }
    
    .error-message h1 {
      font-size: 1.8rem;
    }
    
    .university-illustration {
      height: 200px;
      margin: 20px 0;
    }
    
    .building {
      width: 140px;
      height: 140px;
    }
    
    .roof {
      width: 180px;
      top: -25px;
    }
    
    .tower {
      height: 60px;
      top: -60px;
    }
    
    .sign {
      right: 10%;
    }
    
    .links {
      flex-direction: column;
      align-items: center;
    }
    
    .btn {
      width: 100%;
      max-width: 300px;
      justify-content: center;
    }
  }
  </style>