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

        submitHandler: function () {

            loginUser();

        }
    });

    async function loginUser() {

        const API = 'http://localhost:3000/users';

        const username = $("#username").val();
        const password = $("#password").val();

        try {

            let data = await fetch(
                `${API}?username=${username}&password=${password}`
            );

            let response = await data.json();

            console.log(response);

            if (response.length > 0) {

                alert("Login successful");

                localStorage.setItem(
                    'user',
                    JSON.stringify(response[0])
                );

                window.location.href = 'app.html';

            } else {

                alert("Invalid username or password");
            }

        }

        catch (error) {

            console.log("error occurred", error);
        }
    }

});