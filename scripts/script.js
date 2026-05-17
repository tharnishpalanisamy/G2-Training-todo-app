let name = document.querySelector(".name")
name.innerText = `Welcome, ${localStorage.getItem("username")}`

$('#task-form').submit(function(e){
    e.preventDefault() 

    const task = {
        userId:localStorage.getItem("userId"),
        title:$('#task-title').val(),
        priority:$('#priority').val(),
        dueDate:$('#due-date').val() , 
        completed:false  , 
        deleted : false 

    }
    $('#task-title').val('')
    $('#priority').val('')
    $('#due-date').val('')

    createTask(task)
    bootstrap.Modal.getOrCreateInstance($('#taskModal')).hide()

})
//task creation  

function createTask(task){
    let div = document.createElement("div")
    div.classList.add("task-card","bg-light")
    div.innerHTML = `
        <div class=task-header>
        <h5 class="task-title">${task.title}</h5>
        <p class='${task.priority} priority'>${task.priority}</p>
        </div>
        <p>Due Date: ${task.dueDate}</p>
    `
    document.querySelector(".task-container").appendChild(div)
}
