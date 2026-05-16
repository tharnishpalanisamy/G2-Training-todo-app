    $(document).ready(function () {
    //next buttons
    $("#tabs").tabs();
    $("#next1").click(function () {
        $("#tabs").tabs("option", "active", 1);
    });
    $("#next2").click(function () {
        $("#tabs").tabs("option", "active", 2);
    });
    $("#next3").click(function () {
        $("#tabs").tabs("option", "active", 3);
    });

    //previous buttons
    $("#prev1").click(function () {
        $("#tabs").tabs("option", "active", 0);
    });
    $("#prev2").click(function () {
        $("#tabs").tabs("option", "active", 1);
    });
    $("#prev3").click(function () {
        $("#tabs").tabs("option", "active", 2);
    });

    //validarions
    $("#signin-form").validate({
        rules: {
        firstName: {
            required: true,
            minlength: 2,
        },
        lastName: {
            required: true,
            minlength: 1,
        },
        gender: {
            required: true,
        },
        dob: {
            required: true,
        },
        email: {
            required: true,
            email: true,
        },
        phone: {
            required: true,
            digits: true,
            minlength: 10,
            maxlength: 10,
        },
        country: {
            required: true,
        },
        state: {
            required: true,
        },
        city: {
            required: true,
        },
        username: {
            required: true,
            minlength: 6,
        },
        password: {
            required: true,
            minlength: 8,
        },
        confirmPassword: {
            required: true,
            minlength: 8,
            equalTo: "#password",
        },
        terms: {
            required: true,
        },
        },
        messages: {
        firstName: {
            required: "First name cannot be empty",
            minlength: "First name should be minimum 2 characters",
        },
        lastName: {
            required: "Last name cannot be empty",
            minlength: "Last name should be minimum 1 character",
        },
        gender: {
            required: "Please select your gender",
        },
        dob: {
            required: "Please select your date of birth",
        },
        email: {
            required: "Email cannot be empty",
            email: "Please enter a valid email address",
        },
        phone: {
            required: "Phone number cannot be empty",
            digits: "Please enter only digits",
            minlength: "Phone number should be at least 10 digits",
            maxlength: "phone number should not exceed 10 digits",
        },
        country: {
            required: "Country cannot be empty",
        },
        state: {
            required: "State cannot be empty",
        },
        city: {
            required: "City cannot be empty",
        },
        username: {
            required: "Username cannot be empty",
            minlength: "Username should be at least 6 characters",
        },
        password: {
            required: "Password cannot be empty",
            minlength: "Password should be at least 8 characters",
        },
        confirmPassword: {
            required: "Please confirm your password",
            minlength: "Password should be at least 8 characters",
            equalTo: "Passwords do not match",
        },
        },
        submitHandler: function (form) {
        alert("Form submitted successfully!");
        },
        Highlight:function(element){
        $(element).addClass("is-invalid")
        }, 
        unHightlight:function(element){
        $(element).removeClass("is-invalid")
        } ,
        errorPlacement:function(error,element){
        if(element.attr("name") == "gender"){
    error.insertAfter("#other");
}
else{
    error.insertAfter(element);
}
        }
        
    });
    });
