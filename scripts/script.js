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
        <div class="task-card">

    <!-- TOP ROW -->

    <div class="task-top">

        <div class="left">

            <h5 class="task-title">
                ${task.title}
            </h5>

            <span class="${task.priority} priority">
                ${task.priority}
            </span>

        </div>

        <div class="btn-container">

            <button class="btn btn-sm btn-success">
                Edit
            </button>

            <button class="btn btn-sm btn-danger">
                Delete
            </button>

        </div>

    </div>


    <!-- BOTTOM ROW -->

    <p class="due-date">
        Due Date: ${task.dueDate}
    </p>

</div>
    `
    document.querySelector(".task-container").appendChild(div)
}
