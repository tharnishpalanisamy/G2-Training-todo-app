$(document).ready(function(){
    let name = document.querySelector(".name")
    let profileName = document.querySelector(".profile")
    let user = JSON.parse(localStorage.getItem("user"))
    let curPage = 'pending'

    if(!name) {
        window.location.href = '../index.html'
    }
    let username = user.username 
    let displayName = '' 
    for(let i = 0 ; i < username.length ; i++) {
        if (i==0) {
            displayName += username[i].toUpperCase()
        }
        else{
        displayName += username[i] }
    }
    name.innerHTML = `${displayName}` 
    profileName.innerHTML = `${displayName}`
    $('#due-date').attr(
        'min',
        new Date().toISOString().split('T')[0]
    );
    //pending button disabled
    $("#pending-btn").attr("disabled",true)
    //logout button 
    $(".logoutBtn").click(function () {
        
        Swal.fire({
        title: "Are you sure?",
        text: "Do you want to Logout ?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Logout"
        }).then((result) => {
            
        if (result.isConfirmed){ 
            $(".logout-text").addClass("d-none")
            $(".logout-spinner").removeClass("d-none")
            $(".logoutBtn").attr("disabled", true)

            setTimeout(() => {
                Swal.fire({
                
                title: "Logged Out!",
                text: "Your Account has been logged out.",
                icon: "success"
            }) 
            }, 1500);

            setTimeout(() => {
                window.location.href = '../index.html'
            }, 2500);


        
    }
        });

    })

    //display the profile  
    $(".profileBtn").on('click',function(){
        $('.profile-text').addClass('d-none') 
        $('.profile-spinner').removeClass('d-none') 

        setTimeout(() => {
            $('.profile-text').removeClass('d-none') 
            $('.profile-spinner').addClass('d-none') 

            let div = document.createElement('div') 

            let userDob = new Date(user.dob)
            div.innerHTML = `
            <p><span class=text-seconday>Username :</span> <span class = 'blue'> ${user.username}</span></p>   
            <p><span class=text-seconday>Email :</span> <span class = 'blue'> ${user.email}</span></p>
            <p><span class=text-seconday>Phone :</span> <span class = 'blue'> ${user.phone}</span></p>
            <p><span class=text-seconday>Date of Birth :</span> <span class = 'blue'> 
            ${userDob.getDate()}-${userDob.getMonth()+1}-${userDob.getFullYear()}</span></p>
            `
            $('.profile-content').html(div)
            bootstrap.Modal
            .getOrCreateInstance(document.getElementById('userProfile'))
            .show();
        
        }, 1500);

    })

    //profile edit 

    $(".profileEditBtn").on('click',function(){
        $('#edit-username').val(user.username)
        $('#edit-email').val(user.email) 
        $("#edit-phone").val(user.phone) 
        $("#edit-dob").val(user.dob)
    })
    $(".profileSave").on("click", async function(){
        user.username = $('#edit-username').val() 
        user.dob = $("#edit-dob").val() 
        user.phone = $("#edit-phone").val() 
        user.email = $('#edit-email').val() 
        Swal.fire({
        title: "Changes are saved",
        icon: "success"
        });

        await fetch(`http://localhost:3000/users/${user.id}`,{
            method:"PUT" , 
            headers :{
                'Content-type':"application/json"
            } , 
            body:JSON.stringify(user)
        })
    })

    //for rendering
    async function renderCurrentPage(){
        document.querySelector(".task-container").innerHTML = ""
        if(curPage === 'pending'){
            await loadTask()
        }
        else if(curPage === 'completed'){
            await displayCompleteTasks()
        }
        else if(curPage === 'overdue'){
            await displayOverDueTasks()
        }
        else if(curPage == 'deleted'){
            await displayDeletedTasks()
        }
    }

    //for finding status
    function getTaskStatus(task) {
        let curDate = new Date()
        let dueDate = new Date(task.dueDate)

        curDate.setHours(0, 0, 0, 0)
        dueDate.setHours(0, 0, 0, 0)

        if (task.completed) return 'completed'
        if (curDate > dueDate) return 'overdue'   

        return 'pending'
}


    

    async function loadTask(){
        try{
            let data = await fetch('http://localhost:3000/todos') 
            let tasks = await data.json()
            let curDate = new Date()
            tasks.filter(task => {
                return (
                    task.userId === user.id &&
                    getTaskStatus(task) === 'pending' &&
                    !task.deleted)}).forEach(task=>createTask(task)
            
            )
        }
        catch(error){
            console.error("Failed to load tasks",error)
        }
    }
    loadTask()
    async function postTask(task) {
            try{
                let postedData = await fetch('http://localhost:3000/todos' , {
                method:'POST' , 
                headers:{
                    'content-type':'application/json' 
                } , 
                body:JSON.stringify(task)
                
                })
                if(!postedData.ok){
                    throw new Error("Posting failed")
                }
                let result = await postedData.json() 
                console.log(result);
            }
            catch(error) {
                console.log(error);
                
            }
            
        }
    $("#addTaskBtn").on('click',async function(){

        if (!$('#task-title').val() || !$('#priority').val() || !$('#due-date').val()) {
            Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Please fill all the required fiedls",
            });
            return
        }
        const selectedDate = $('#due-date').val();
        const today = new Date().toISOString().split('T')[0];

        if (selectedDate < today) {
            Swal.fire({
                icon: "error",
                title: "Invalid Date",
                text: "Due date cannot be in the past."
            });
            return;
        }


        const task = {
            id:Date.now(), 
            userId:user.id,
            title:$('#task-title').val(),
            description:$('#description').val(),
            priority:$('#priority').val(),
            dueDate:$('#due-date').val() , 
            completed:false  , 
            deleted : false , 
            overDue:false,
            status : 'pending' , 
            createdAt : new Date().toISOString() , 
            updatedAt: new Date().toISOString()
        }
        $('#task-title').val('')
        $("#description").val('')
        $('#priority').val('')
        $('#due-date').val('')

        await postTask(task)
        console.log(task);

        bootstrap.Modal
        .getOrCreateInstance(
            document.getElementById('taskModal')
        )
        .hide()
        await renderCurrentPage()

    })
    //task creation  

    function createTask(task){
        if (task.deleted === true && curPage != 'deleted'){
            return
        }

        let div = document.createElement("div")

        let stars = ""

        if(task.priority === "High"){
            stars = "⭐⭐⭐⭐⭐"
        }
        else if(task.priority === "Medium"){
            stars = "⭐⭐⭐"
        }
        else{
            stars = "⭐"
        }

        let status = getTaskStatus(task) 
        let statusClass
        if (getTaskStatus(task)==="pending") {
            statusClass = "btn-outline-info"
        }
        else if (getTaskStatus(task)==="completed") {
            statusClass = "btn-outline-success"
        }
        else if (getTaskStatus(task)==="overdue") {
            statusClass = "btn-outline-warning "
        }
        else if(task.deleted){
            statusClass = 'btn-outline-danger'
        }



        div.classList.add("task-card"   )
        div.dataset.id = task.id

        let checked = ""

        if(task.completed === true ){
            checked = "checked"
        }
        let dueDate = new Date(task.dueDate)
        div.innerHTML = `
            <div class='task-item p-2 '> 
                <div class='task-header d-flex justify-content-between px-2'> 
                    <div class = 'task-header-left d-flex gap-4'>
                        <input type = 'checkbox' class = 'completed-checkbox' data-id = '${task.id}' ${checked}>
                        <h3 class='fw-bold blue' > ${task.title} </h3> 
                        <p>${stars} </p> 
                    </div> 
                        
                    <div class = 'task-header-right d-flex gap-2'> 
                        <button type='button' class = 'btn btn-warning editBtn' data-id='${task.id}' ><i class="fa-regular fa-pen-to-square"></i> Edit </button>
                        <button type='button' class = 'btn btn-danger deleteBtn' data-id='${task.id}'  >
                        <span class = 'delete-text'><i class="fa-regular fa-trash-can"></i> Delete </span>
                        <span class="spinner-border spinner-border-sm d-none delete-spinner"
                        role="status"
                        ></span>
                        </button> 
                    </div> 
                </div>
                
                <div class = 'task-body d-flex flex-column gap-2'> 
                    <div class = 'task-body-left d-flex gap-2 align-items-center pt-1' > 
                        <h5 class = 'fw-bold pt-1' > Due Date : ${dueDate.getDate()}-${dueDate.getMonth()+1}-${dueDate.getFullYear()} </h5> 
                        <a class = 'btn ${statusClass} rounded-pill' > ${status} </a>
                    </div> 
                    <div class = 'task-description' > 
                        <p class = 'text-secondary' > ${task.description} </p>
                    </div>

                </div>
            </div>
            `

        document.querySelector(".task-container")
            .appendChild(div)
    }
let currentEditTask = null

//edit button
document.addEventListener('click', async function(event){

    if(event.target.closest('.editBtn')){
        let taskId = event.target.dataset.id

        let response = await fetch(`http://localhost:3000/todos/${taskId}`)
        let task = await response.json()
        currentEditTask = task 
        $('#edit-id').val(task.id)
        $('#edit-title').val(task.title)
        $('#edit-description').val(task.description)
        $('#edit-priority').val(task.priority)
        $('#edit-due-date').val(task.dueDate)

        bootstrap.Modal
        .getOrCreateInstance(document.getElementById('editTaskModal'))
        .show()
    }
})

$('#updateTaskBtn').on('click', async function(){
    

    let id = $("#edit-id").val()
    
    let updatedTask = {
        id: id,
        userId: user.id,
        title: $("#edit-title").val(),
        description: $("#edit-description").val(),
        priority: $("#edit-priority").val(),
        dueDate: $("#edit-due-date").val(),
        completed: currentEditTask.completed,
        deleted: currentEditTask.deleted,
        updatedAt: new Date().toISOString(),
        status:currentEditTask.completed
        ? 'completed'
        : new Date() > new Date($("#edit-due-date").val())
        ? 'overdue'
        : 'pending'
    }

    await fetch(`http://localhost:3000/todos/${id}`,{
        method:'PUT',
        headers:{
            'Content-type':'application/json'
        },
        body:JSON.stringify(updatedTask)
    })

    bootstrap.Modal
        .getOrCreateInstance(document.getElementById('editTaskModal'))
        .hide()

    await renderCurrentPage()
})  
//delete
async function deleteTask(task){

    task.status = 'deleted' 
    task.deleted = true 

    await fetch(`http://localhost:3000/todos/${task.id}` , {
        method:'PUT',
        headers:{
            'Content-type':'application/json'
        },
        body:JSON.stringify(task)
    })

    document
    .querySelector(`[data-id="${task.id}"]`)
    .remove()
}
$(document).on('click', async function(event){

    let btn = event.target.closest('.deleteBtn');
    if (!btn) return 

    let result = await Swal.fire({
        title: "Are you sure?",
        text: "Do you want to delete this Task ?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    })

    if (result.isConfirmed){
        let taskId = btn.dataset.id;

        let response = await fetch(`http://localhost:3000/todos/${taskId}`);
        let task = await response.json();

        $(btn).find('.delete-text').addClass('d-none');
        $(btn).find('.delete-spinner').removeClass('d-none');

        setTimeout(async () => {
            await deleteTask(task);
        }, 1200);
        
        setTimeout(() => {
            Swal.fire({
        title: "Deleted!",
        text: "Your file has been Moved to deleted tasks!.",
        icon: "success"
    })
        }, 1200);
}
});

//checbbox


$(document).on('change', async function(event){

if(event.target.classList.contains('completed-checkbox')) {

let taskId = event.target.dataset.id 

let response = await fetch(`http://localhost:3000/todos/${taskId}`) 
let task = await response.json() 

let isChecked = event.target.checked 

task.completed = isChecked 
task.updatedAt = new Date().toISOString()

await fetch(`http://localhost:3000/todos/${taskId}` , {
    method:"PUT",
    headers:{
        'Content-type':'application/json'
    },
    body:JSON.stringify(task)
})

let card = event.target.closest('.task-card')

if(curPage === 'pending' && task.completed){
    card.classList.add('removing')
    setTimeout(()=>{
        card.remove()
    },300)
}
else if(curPage === 'completed' && !task.completed){
    card.classList.add('removing')
    setTimeout(()=>{
        card.remove()
    },300)
}
else if(curPage === 'overdue' && task.completed){
    card.classList.add('removing')
    setTimeout(()=>{
        card.remove()
    },300)
}
}
})
//show pending tasks 
$("#pending-btn").on('click',async function(){
    curPage = 'pending' 
    $("#pending-btn").attr("disabled",true)
    $("#completed-btn").attr("disabled",false)
    $("#overdue-btn").attr("disabled",false)
    $("#DeletedTasksBtn").attr("disabled",false)    


    await renderCurrentPage() 
})

//show completed takss 
async function displayCompleteTasks(){
    try{
            let data = await fetch('http://localhost:3000/todos') 
            let tasks = await data.json()
            tasks.filter(task=>task.userId === user.id && getTaskStatus(task) === 'completed').forEach(task=>createTask(task))
        }
        catch(error){
            console.error("Failed to load tasks",error)
        }
    }
    
//completed btn 
$('#completed-btn').on('click',async function(event){
    curPage = 'completed' 
    $("#pending-btn").attr("disabled",false)
    $("#completed-btn").attr("disabled",true)
    $("#overdue-btn").attr("disabled",false)
    $("#DeletedTasksBtn").attr("disabled",false)
    await renderCurrentPage()
})


//overdue
async function displayOverDueTasks() {
try {
    let response = await fetch('http://localhost:3000/todos')
    let tasks = await response.json()

    tasks
        .filter(task => task.userId == user.id && getTaskStatus(task) === 'overdue' && !task.deleted)
        .forEach(task => createTask(task))
}
catch(error) {
    console.log(error)
}
}

$("#overdue-btn").on('click',async function(){
    curPage = "overdue" 
    $("#pending-btn").attr("disabled",false)
    $("#completed-btn").attr("disabled",false)
    $("#overdue-btn").attr("disabled",true)
    $("#DeletedTasksBtn").attr("disabled",false)
    await renderCurrentPage()
})


//deleted 
async function displayDeletedTasks(){
    const API = ' http://localhost:3000/todos' 

    let response = await fetch(API) 
    let tasks = await response.json() 

    tasks.filter(task=>task.deleted === true && task.userId === user.id)
    .forEach(task=>{
        createDeletedTask(task)
    })
}

function createDeletedTask (task){

    let div = document.createElement("div") 
    div.classList.add("task-card" , "deleted")
    div.dataset.id = task.id
    let stars = "" 
    if (task.priority == 'High') stars = '⭐⭐⭐⭐⭐' 
    else if(task.priority =='Medium') stars = '⭐⭐⭐' 
    else if(task.priority == 'Low') stars = '⭐'  

    let dueDate = new Date(task.dueDate)
    div.innerHTML = `
            <div class='task-item p-2 '> 
                <div class='task-header d-flex justify-content-between px-2'> 
                    <div class = 'task-header-left d-flex gap-4'>
                        <h3 class='fw-bold blue' > ${task.title} </h3> 
                        <p>${stars} </p> 
                    </div> 
                        
                    <div class = 'task-header-right d-flex gap-2'> 
                        <button type='button' class = 'btn btn-success restoreBtn' data-id='${task.id}'  >
                        <span class =' restore-text' >
                         <i class="fa-solid fa-recycle"></i> Restore 
                         </span> 

                        <span class = 'spinner-border spinner-border-sm d-none restore-spinner' ></span>

                         </button> 
                    </div> 
                </div>
                
                <div class = 'task-body d-flex flex-column gap-2'> 
                    <div class = 'task-body-left d-flex gap-2 align-items-center pt-1' > 
                        <h5 class = 'fw-bold pt-1' > Due Date : ${dueDate.getDate()}-${dueDate.getMonth()+1}-${dueDate.getFullYear()} 
                        </h5> 
                        <button class = 'btn btn-outline-danger rounded-pill' > deleted </button>
                    </div> 
                    <div class = 'task-description' > 
                        <p class = 'text-secondary' > ${task.description} </p>
                    </div>

                </div>
            </div>
            `
            document.querySelector(".task-container")
            .appendChild(div)
}
$("#DeletedTasksBtn").on('click',async function(){
        curPage = 'deleted'
        $("#pending-btn").attr("disabled",false)
        $("#completed-btn").attr("disabled",false)
        $("#overdue-btn").attr("disabled",false)
        $("#DeletedTasksBtn").attr("disabled",true)
        renderCurrentPage()
})

//restore 
$(document).on('click',async function(event){
    $(document).on('click', async function(event){
        let restoreBtn = event.target.closest('.restoreBtn')
        let taskId = restoreBtn.dataset.id 
        const API = 'http://localhost:3000/todos'  

        $(restoreBtn).find('.restore-text').addClass('d-none') 
        $(restoreBtn).find('.restore-spinner').removeClass('d-none') 

        let response = await fetch(`${API}/${taskId}`) 
        let task = await response.json() 

        task.deleted = false 
        let curDate = new Date() 
        let dueDate = new Date(task.dueDate)
        curDate.setHours(0, 0, 0, 0)
        dueDate.setHours(0, 0, 0, 0)
        if(task.completed){
            task.status = 'completed'
        }
        else if(curDate > dueDate){
            task.status = 'overdue'
        }
        else{
            task.status = 'pending'
        }

        await fetch(`${API}/${taskId}`,{
            method:"PUT" , 
            headers:{
                'Content-type':'application/json' 
            } , 
            body : JSON.stringify(task)
        })

        

        setTimeout(() => {
            document.querySelector(`[data-id="${task.id}"]`).remove()
            Swal.fire({
            title: `Task is successfully restored and moved to ${task.status} tasks`,
            icon: "success",
            });
        }, 1200);
    }) 
    
    
    
})
}) 

