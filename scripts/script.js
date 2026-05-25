            $(document).ready(function(){
                let name = document.querySelector(".name")
                let user = JSON.parse(localStorage.getItem("user"))
                let curPage = 'pending'
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


                if(!name) {
                    window.location.href = '../index.html'
                }
                name.innerText = `Welcome, ${user.username}` 

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
                        stars = "⭐⭐⭐"
                    }
                    else if(task.priority === "Medium"){
                        stars = "⭐⭐"
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



                    div.classList.add("task-card")

                    let checked = ""

                    if(task.completed === true ){
                        checked = "checked"
                    }
                    div.innerHTML = `
                        <div class='task-item p-2 '> 
                            <div class='task-header d-flex justify-content-between px-2'> 
                                <div class = 'task-header-left d-flex gap-4'>
                                    <input type = 'checkbox' class = 'completed-checkbox' data-id = '${task.id}' ${checked}>
                                    <h3 class='fw-bold blue' > ${task.title} </h3> 
                                    <p>${stars} </p> 
                                </div> 
                                    
                                <div class = 'task-header-right d-flex gap-2'> 
                                    <button type='button' class = 'btn btn-warning editBtn' data-id='${task.id}' > Edit </button>
                                    <button type='button' class = 'btn btn-danger deleteBtn' data-id='${task.id}'  > Delete </button> 
                                </div> 
                            </div>
                            
                            <div class = 'task-body d-flex flex-column gap-2'> 
                                <div class = 'task-body-left d-flex gap-2 align-items-center pt-1' > 
                                    <h5 class = 'fw-bold pt-1' > Due Date : ${task.dueDate} </h5> 
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

                if(event.target.classList.contains('editBtn')){
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
                task.status = 'delete' 
                task.deleted = true 

                await fetch(`http://localhost:3000/todos/${task.id}` , {
                    method:'PUT' , 
                    headers:{
                        'Content-type':'application/json' 
                    } , 
                    body:JSON.stringify(task)
                })
                await renderCurrentPage()
            }
            $(document).on('click',async function(event){
                if(event.target.classList.contains("deleteBtn")) {
                    let taskId = event.target.dataset.id 

                    let response = await fetch(`http://localhost:3000/todos/${taskId}`)  

                    let task = await response.json() 

                    await deleteTask(task) 

                }
            })

            //checbbox


            $(document).on('change',async function(event){
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
                        } , 
                        body:JSON.stringify(task)
                    })

                        await renderCurrentPage()
                    
                }
            })
            //show pending tasks 
            $("#pending-btn").on('click',async function(){
                curPage = 'pending' 
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
                div.classList.add(".task-card")
                let stars = "" 
                if (task.priority == 'High') stars = '⭐⭐⭐' 
                else if(task.priority =='Medium') stars = '⭐⭐' 
                else if(task.priority == 'Low') stars = '⭐' 
                div.innerHTML = `
                        <div class='task-item p-2 '> 
                            <div class='task-header d-flex justify-content-between px-2'> 
                                <div class = 'task-header-left d-flex gap-4'>
                                    <h3 class='fw-bold blue' > ${task.title} </h3> 
                                    <p>${stars} </p> 
                                </div> 
                                    
                                <div class = 'task-header-right d-flex gap-2'> 
                                    <button type='button' class = 'btn btn-success restoreBtn' data-id='${task.id}'  > Restore </button> 
                                </div> 
                            </div>
                            
                            <div class = 'task-body d-flex flex-column gap-2'> 
                                <div class = 'task-body-left d-flex gap-2 align-items-center pt-1' > 
                                    <h5 class = 'fw-bold pt-1' > Due Date : ${task.dueDate} </h5> 
                                    <a class = 'btn btn-outline-danger rounded-pill' > deleted </a>
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
                    renderCurrentPage()
            })

            //restore 
            $(document).on('click',async function(event){
                if(event.target.classList.contains('restoreBtn')){
                    let taskId = event.target.dataset.id 
                    const API = 'http://localhost:3000/todos'  

                    let response = await fetch(`${API}/${taskId}`) 
                    let task = await response.json() 

                    task.deleted = false 

                    if(task.completed){
                        task.status = 'completed'
                    }
                    else if(new Date() > new Date(task.dueDate)){
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
                    await renderCurrentPage()
                }
                
                
            })
            }) 

