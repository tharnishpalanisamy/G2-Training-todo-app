        $(document).ready(function () {


        //$('#dob').attr('max',new Date('2012-12-31').toISOString().split('T')[0]);
        //local storage
        $('#firstname').val(localStorage.getItem('firstName'))
        $("#middlename").val(localStorage.getItem('middleName')) 
        $("#lastname").val(localStorage.getItem('lastName')) 
        let savedGender = localStorage.getItem('gender');
        $(`input[name='gender'][value='${savedGender}']`).prop('checked', true);
        $("#dob").val(localStorage.getItem('dob')) 

        //tab -  2 

        $("#email").val(localStorage.getItem('email'))
        $("#phone").val(localStorage.getItem('phone'))
        $("#country").val(localStorage.getItem('country'))
        $("#state").val(localStorage.getItem('state'))
        $("#city").val(localStorage.getItem('city'))

        // //tab - 3 

        $("#username").val(localStorage.getItem('username'))
        $("#password").val(localStorage.getItem('password'))
        $("#confirm-password").val(localStorage.getItem('confirm-password'))
            
            // document.querySelectorAll('input').forEach(
            //     input =>{
            //         input.value = localStorage.getItem(input.id) || ""
            //     }
            //)

        //next buttons
        $("#tabs").tabs();
        $("#next1").click(function (e) {

        e.preventDefault();
        

        if (
            $("#firstname").valid() &&
            $("#lastname").valid() &&
            $("input[name='gender']").valid() &&
            $("#dob").valid()
        ) {
            localStorage.setItem('firstName',$("#firstname").val())
            localStorage.setItem('middleName',$("#middlename").val())
            localStorage.setItem('lastName',$("#lastname").val())
            localStorage.setItem('gender',$("input[name='gender']:checked").val())
            console.log(localStorage.getItem('gender'));
            localStorage.setItem('dob',$("#dob").val())

            // document.querySelectorAll('input').forEach(
            //     input =>{
            //         if(input.type == 'radio'){
            //             
            //         }
            //         localStorage.setItem(input.id , input.value)
            //     }
            // )


            $("#tabs").tabs("option", "active", 1);
        }
    });
        $("#next2").click(function (e) {

        e.preventDefault();

        if (
            $("#email").valid() &&
            $("#phone").valid() &&
            $("#country").valid() &&
            $("#state").valid() &&
            $("#city").valid()
        ) {
            localStorage.setItem('email',$('#email').val())
            localStorage.setItem('phone',$('#phone').val())
            localStorage.setItem('country',$('#country').val())
            localStorage.setItem('state',$('#state').val())
            localStorage.setItem('city',$('#city').val())

            // document.querySelectorAll('input').forEach(
            //     input =>{
            //         localStorage.setItem(input.id , input.value)
            //     }
            // )

            $("#tabs").tabs("option", "active", 2);
        }
    });
        $("#next3").click(function (e) {

        e.preventDefault();

        if (
            $("#username").valid() &&
            $("#password").valid() &&
            $("#confirm-password").valid()
        ) {
            localStorage.setItem('username',$('#username').val())
            localStorage.setItem('password',$('#password').val())
            localStorage.setItem('confirm-password',$('#confirm-password').val())
            // document.querySelectorAll('input').forEach(
            //     input =>{
            //         localStorage.setItem(input.id , input.value)
            //     }
            // )


            $("#tabs").tabs("option", "active", 3);
        }
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
                max:'2012-12-31'
                
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
                max : 'you are not old enough to create account'
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
            submitHandler: function (form, event) {
            event.preventDefault();

            $('.register-text').addClass('d-none')
            $('.register-spinner').removeClass('d-none')
            $('.registerBtn').attr('disabled', true)

            setTimeout(() => {

            const API = 'http://localhost:3000/users'

            let email = $("#email").val()
            let username = $("#username").val()
            let password = $("#password").val()
            let phone = $('#phone').val()
            let dob = $("#dob").val() 

            fetch(API, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
            body: JSON.stringify({
                email: email,
                username: username,
                phone:phone,
                dob:dob,
                password: password
            })
        })
        .then((res) => {
            if(!res.ok) {
                throw new Error('account creation failed')
            }
            return res.json()
        })
        .then((res) => {
            console.log('user created');

            setTimeout(() => {
                    Swal.fire({
                    title: "Account Created Successfully",
                    icon: "success",
                    });
                }, 1000);
                setTimeout(() => {
                    localStorage.clear()
                    window.location.href = './login.html'
                    
                }, 3000);
        })
        .catch(error => {
            console.log(error)

            $('.register-text').removeClass('d-none')
            $('.register-spinner').addClass('d-none')
            $('.registerBtn').attr('disabled', false)
        })

    }, 100)

    return false
},
            highlight:function(element){
        $(element).addClass("is-invalid")
    }, 
    unhighlight:function(element){
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
