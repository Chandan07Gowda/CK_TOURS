

import { showAlert } from "./alerts.js";
// import axios from  'axios';
export const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:3000/api/v1/users/login',  
      data: {
        email,
        password,
      },
    });
    console.log(res);
    if(res.data.status === 'SUCCESS'){
      showAlert('SUCCESS','logged in successfully');
      window.setTimeout(()=>{
        location.assign('/');
      },500)
    }
    console.log(res)    
  } catch (error) {
   
    showAlert('Error',error.response.data.message) 
  }
};


document.querySelector('form').addEventListener('submit', (e) => {
  e.preventDefault();  
  
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  
  console.log(email, password);
  login(email, password); 
});


