$(document).ready(function () {
    $(".login-form").validate({
    rules: {
        username: {
        required: true,
        minlength: 3,
        },
        password: {
        required: true,
        minlength: 8,
        },
    },
    messages: {
        username: {
        required: "Username cannot be empty",
        minlength: "Username should be inimum 3 characters",
        },
        password: {
        required: "Password cannot be empty",
        minlength: "Password should be above 8 characters",
        },
    },
    submitHandler: async function(form) {
        const API = 'http://localhost:3000/users'
        let username = $("#username").val()  
        let password = $("#password").val()

        let response = await fetch(`${API}?username=${username}&password=${password}`) 
        let result = await response.json() 

        if (result.length > 0) {
            localStorage.setItem("user",JSON.stringify(result[0])) 
            alert("login Successful")
            window.location.href = "../index.html"
        } 
        else{
            alert("Invalid username or password")
        }

    }
    });
});