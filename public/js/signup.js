import { showAlert } from "./alerts.js";
// import axios from 'axios';

export const signup = async (name, email, password, passwordConfirm) => {
  // Check if password and confirm password match
  if (password !== passwordConfirm) {
    showAlert('Error', 'Passwords do not match!');
    return;
  }

  try {
    // Send the data to the server for signup
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:3000/api/v1/users/signup',  
      data: {
        name,
        email,
        password,
        passwordConfirm
      },
    });

    // Check if the server response status is 'SUCCESS'
    if (res.data.status === 'SUCCESS') {
      showAlert('SUCCESS', 'Signed up successfully!');
      window.setTimeout(() => {
        location.assign('/'); // Redirect to home page
      }, 500);
    }
  } catch (error) {
    // Handle error from API response
    showAlert('Error', error.response?.data?.message || 'An unexpected error occurred');
  }
};

// Add event listener for form submission
document.querySelector('form').addEventListener('submit', (e) => {
  e.preventDefault();  // Prevent the default form submission behavior

  // Get the form values
  const name = document.getElementById('name').value;  // Get the name field value
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const passwordConfirm = document.getElementById('passwordConfirm').value;

  // Call the signup function with the name field included
  signup(name, email, password, passwordConfirm); 
});
