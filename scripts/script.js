let name = document.querySelector(".name")
name.innerText = `Welcome, ${localStorage.getItem("username")}`

$('#task-form').submit(function(e){
    e.preventDefault() 

    const task = {
        userId:localStorage.getItem("userId"),
        title:$('#task-title').val(),
        description:$('#description').val(),
        priority:$('#priority').val(),
        dueDate:$('#due-date').val() , 
        completed:false  , 
        deleted : false 

    }
    $('#task-title').val('')
    $('#description').val('')
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
        <h5>${task.title}</h5>
        <p>${task.description}</p>
        <p>Priority: ${task.priority}</p>
        <p>Due Date: ${task.dueDate}</p>
    `
    document.querySelector(".task-container").appendChild(div)
}
