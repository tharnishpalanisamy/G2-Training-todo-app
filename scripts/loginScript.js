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
                minlength: "Username should be minimum 3 characters",
            },

            password: {
                required: "Password cannot be empty",
                minlength: "Password should be above 8 characters",
            },
        },

        submitHandler: function (form, event) {

            event.preventDefault(); // IMPORTANT

            loginUser();
        }
    });

    async function loginUser() {

        const API = 'http://localhost:3000/users';

        let username = $("#username").val();
        let password = $("#password").val();

        try {

            let response = await fetch(
                `${API}?username=${username}&password=${password}`
            );

            let result = await response.json();

            console.log(result);

            if (result.length > 0) {

                localStorage.setItem(
                    "user",
                    JSON.stringify(result[0])
                );

                alert("Login Successful");

                window.location.href = "app.html";

            } else {

                alert("Invalid username or password");
            }

        } catch (error) {

            console.log(error);

            alert("Server Error");
        }
    }
});