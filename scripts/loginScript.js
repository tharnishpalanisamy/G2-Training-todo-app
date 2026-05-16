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
    submitHandler: function (form) {
        alert("Login successful!");
    },
    });
});