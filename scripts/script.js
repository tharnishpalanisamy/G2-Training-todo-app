$(document).ready(function(){
let name = document.querySelector(".name")
let user = JSON.parse(localStorage.getItem("user"))

if(!name) {
    window.location.href = '../index.html'
}
name.innerText = `Welcome, ${user.username}` 

async function loadTask(){
    try{
        let data = await fetch('http://localhost:3000/todos') 
        let tasks = await data.json()
        tasks.filter(task=>task.userId === user.id).forEach(task=>createTask(task))
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
$("#addTaskBtn").on('click',function(){

    if (!$('#task-title').val() || !$('#priority').val() || !$('#due-date').val()) {
        alert('Please fill in required fields')
        return
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
        status : 'pending' , 
        createdAt : new Date().toISOString() , 
        updatedAt: new Date().toISOString()
    }
    $('#task-title').val('')
    $("#description").val('')
    $('#priority').val('')
    $('#due-date').val('')

    postTask(task)
    console.log(task);
    
    
    
    
    bootstrap.Modal
    .getOrCreateInstance(
        document.getElementById('taskModal')
    )
    .hide()

})
//task creation  

function createTask(task){

    let div = document.createElement("div")

    let stars = ""

    if(task.priority === "High"){
        stars = "⭐⭐⭐"
    }
    else if(task.priority === "Medium"){
        stars = "⭐⭐"
    }
    else{
        stars = "⭐"
    }

    let status = task.status 
    let statusClass
    if (status=="pending") {
        statusClass = "btn-warning"
    }
    else if (status=="completed") {
        statusClass = "btn-success"
    }
    else if (status=="overdue") {
        statusClass = "btn-danger"
    }



    div.classList.add("task-card")

    div.innerHTML = `
        <div class='task-item p-2 '> 
            <div class='task-header d-flex justify-content-between px-2'> 
                <div class = 'task-header-left d-flex gap-4'>
                    <input type = 'checkbox' class = 'completed-checkbox' id = '${task.taskId}'>
                    <h3 class='fw-bold blue' > ${task.title} </h3> 
                    <p>${stars} </p> 
                </div> 
                    
                <div class = 'task-header-right d-flex gap-2'> 
                    <button type='button' class = 'btn btn-warning' > Edit </button>
                    <button type='button' class = 'btn btn-danger' > Delete </button> 
                </div> 
            </div>
            
            <div class = 'task-body d-flex flex-column gap-2'> 
                <div class = 'task-body-left d-flex gap-2 align-items-center pt-1' > 
                    <h5 class = 'fw-bold pt-1' > Due Date : ${task.dueDate} </h5> 
                    <a class = 'btn ${statusClass} text-light rounded-pill' > ${task.status} </a>
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
})