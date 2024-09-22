let dataDiv = document.getElementById('data')
let deleteDiv = document.getElementsByClassName('modal')
let deleteDivText = document.getElementsByClassName('delete-text')
deleteDiv[0].style.display = "none"
let idOfMemberToBeDeleted = ""
let members = []

let stopPropagation = (event)=>{
    event.stopPropagation()
}

let handleDelete = (id, name)=>{
    deleteDiv[0].style.display = "flex"
    deleteDivText[0].textContent = `Are you sure you want to delete member ${name} ?` 
    idOfMemberToBeDeleted = id
}

let deleteMember = ()=>{
    deleteDiv[0].style.display = "none"
    fetch(`/api/members?id=${idOfMemberToBeDeleted}`,{
        "method" : "DELETE"
    })
    .then((res)=>{
        if(!res.ok){
            if(res.status===403){
                throw new Error('Access to requested resource is for admin only. Login as admin to access the resource')
            }
            throw new Error('Service is currently down.Try Again Later')
        }
        return res.json()})
    .then((msg)=>{
        fetchData()
        alert("Member deleted successfully")
    })
    .catch((err)=>{
        console.log(err)
        alert(err.message)
    })
}

let discard = ()=>{
    idOfMemberToBeDeleted = ""
    deleteDiv[0].style.display = "none"
}

const fetchData = () => {
    fetch("/api/members", { method: "GET" })
        .then((res) => {
            if(!res.ok){
                if(res.status===403){
                    throw new Error('Access to requested resource is for admin only. Login as admin to access the resource')
                }
                throw new Error('Service is currently down.Try Again Later')
            }
            return res.json()
        })
        .then((res) => {
            let output = ''
            let membersData = res.data
            members = res.data
            membersData.forEach((data, index) => {
                output += `
                <div class="single-member">
                    <div class="img-src">
                        <img src="${data.image}">
                    </div>
                    <div class="name">
                        <span>${data.name}</span>
                    </div>
                    <div class="options">
                    <!--Edit--icon-->                    
                        <div onclick="handleEdit('${index}')" id="edit">
                            <svg xmlns="http://www.w3.org/2000/svg" id="edit" width="20" height="20" fill="#4d4848" class="bi bi-pencil-square" viewBox="0 0 16 16">
                                <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                                <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                            </svg>
                        </div>
                    <!-- Trash bin icon -->
                        <div id="delete" onclick="handleDelete('${data._id}', '${data.name}')">
                            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="24" viewBox="0,0,256,256" id="delete">
                                <g fill="#4d4848" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" id="delete"
                                stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal">
                                    <g transform="scale(4,4)">
                                        <path d="M28,7c-2.757,0 -5,2.243 -5,5v3h-10c-1.104,0 -2,0.896 -2,2c0,1.104 0.896,2 2,2h2.10938l1.68359,30.33203c0.178,3.178 2.80723,5.66797 5.99023,5.66797h18.43359c3.182,0 5.81223,-2.48997 5.99023,-5.66797l1.68359,-30.33203h2.10938c1.104,0 2,-0.896 2,-2c0,-1.104 -0.896,-2 -2,-2h-10v-3c0,-2.757 -2.243,-5 -5,-5zM28,11h8c0.552,0 1,0.449 1,1v3h-10v-3c0,-0.551 0.448,-1 1,-1zM19.11328,19h25.77344l-1.67383,30.10938c-0.059,1.06 -0.93509,1.89063 -1.99609,1.89063h-18.43359c-1.06,0 -1.93709,-0.82967 -1.99609,-1.88867zM32,23.25c-0.967,0 -1.75,0.784 -1.75,1.75v20c0,0.966 0.783,1.75 1.75,1.75c0.967,0 1.75,-0.784 1.75,-1.75v-20c0,-0.966 -0.783,-1.75 -1.75,-1.75zM24.64258,23.25195c-0.965,0.034 -1.7205,0.84259 -1.6875,1.80859l0.69727,20.08594c0.033,0.945 0.81005,1.68945 1.74805,1.68945c0.021,0 0.0415,0 0.0625,0c0.965,-0.034 1.7205,-0.84455 1.6875,-1.81055l-0.69727,-20.08594c-0.034,-0.965 -0.84655,-1.7105 -1.81055,-1.6875zM39.35547,23.25195c-0.967,-0.027 -1.77459,0.7225 -1.80859,1.6875l-0.69727,20.08594c-0.034,0.966 0.7215,1.77655 1.6875,1.81055c0.021,0.001 0.0415,0 0.0625,0c0.938,0 1.71505,-0.74445 1.74805,-1.68945l0.69727,-20.08594c0.034,-0.966 -0.72345,-1.77459 -1.68945,-1.80859z"></path>
                                    </g>
                                </g>
                            </svg>
                        </div>
                    </div>
                </div>

            `
            });
            dataDiv.innerHTML = output
        })
        .catch((err) => {
            console.log(err)
            alert(err.message)
        })
}
fetchData()

//edit form
let editModalDiv = document.querySelectorAll('.modal')[1]
let memberToBeEdited = ''
let handleEdit = (index)=>{
    editModalDiv.style.display = "flex"
    const {_id:id,name,position,techStack,image,passOutYear,
        linkedinLink,githubLink,instaLink,isActive,company} = members[index]
    const form = document.querySelector('.form');
    const nameInput = form.querySelector('input[name="name"]');
    const positionInput = form.querySelector('select[name="position"]');
    const isActiveInput = form.querySelector('select[name="isActive"');
    const techStackInput = form.querySelector('input[name="techStack"]');
    const filename = form.querySelector('input[name="file"]');
    const passOutYearInput = form.querySelector('input[name="passOutYear"]');
    const linkedinInput = form.querySelector('input[name="linkedinLink"]');
    const githubInput = form.querySelector('input[name="githubLink"]');
    const instaInput = form.querySelector('input[name="instaLink"]');
    const companyInput = form.querySelector('input[name="company"]');
    nameInput.value = name;
    positionInput.value = position;
    techStackInput.value = techStack;
    filename.value = image;
    isActiveInput.value = isActive
    passOutYearInput.value = passOutYear
    linkedinInput.value = linkedinLink
    githubInput.value = githubLink
    instaInput.value = instaLink
    companyInput.value = company
    memberToBeEdited = {id,name,position,techStack,image,passOutYear,
        linkedinLink,githubLink,instaLink,isActive,company}
    console.log(document.getElementsByTagName('form')[0].isActive.value)
    if(document.getElementsByTagName('form')[0].isActive.value==="true"){
        document.getElementsByTagName('form')[0].company.style.display = "none"
    }
}
editModalDiv.style.display = "none"
let x = document.getElementById('inputFile')
let file = ""
x.style.display = "none"
let handleClick = ()=>{
    x.click()
}
let handleChange = (e)=>{
    if(e.target.files[0]===undefined){
        return;
    }
    if(e.target.files[0]?.name){
        let name = e.target.files[0].name.split('.')
        if(name[name.length-1]!=='png' && name[name.length-1]!=='jpg' && name[name.length-1]!=='jpeg'){
            e.target.value = null
            alert('Only png, jpeg and jpg files are allowed')
            return
        }
    }
    document.getElementById('fileName').value = e.target.files[0].name
    file = e.target.files[0]
}
let handleActiveChange = (e)=>{
    let companyInput = document.getElementsByTagName('form')[0].company
    document.getElementsByTagName('form')[0].isActive = e.target.value
    if(e.target.value==="false"){
        companyInput.style.display = "block"
    }
    else{
        companyInput.style.display = "none"
    }
}
let handleSubmit = (e)=>{
    e.preventDefault()
    let formData = new FormData()
    let form = e.target
    formData.append("name",form.name.value)
    formData.append("position", form.position.value)
    formData.append("isActive",form.isActive.value)
    if(form.isActive.value==="false"){
        formData.append("company",form.company.value)
    }
    formData.append("techStack",form.techStack.value)
    formData.append("passOutYear",form.passOutYear.value)
    formData.append("linkedinLink",form.linkedinLink.value)
    formData.append("instaLink",form.instaLink.value)
    formData.append("githubLink",form.githubLink.value)
    if(file)formData.append("image",file)
    formData.append("id",memberToBeEdited.id)
    fetch("/api/members", {
        method: "PUT",
        body: formData,
        credentials : "include"
    })
    .then(response => {
        if(!response.ok){
            if(response.status===403){
                throw new Error('Access to requested resource is for admin only. Login as admin to access the resource')
            }
            throw new Error('Service is currently down.Try Again Later')
        }
        alert('Member Updated')
        editModalDiv.style.display = "none"
        fetchData()
        return response.json()
    })
    .then(data => console.log(data))
    .catch(error => {
        console.error(error)
        alert(error.message)
    })
}
let discardChanges = ()=>{
    memberToBeEdited = {}
    editModalDiv.style.display = "none"
}