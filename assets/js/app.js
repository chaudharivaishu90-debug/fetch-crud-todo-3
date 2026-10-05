var cl=console.log;
const form=document.getElementById("form");
const formInput=document.getElementById("formInput")
const submitBtn=document.getElementById("submitBtn")
const updateBtn=document.getElementById("updateBtn")
const list=document.getElementById("list")
const spinner=document.getElementById("spinner")



const BASE_URL="https://xhrcrud-default-rtdb.firebaseio.com";
const CONTACT_URL=`${BASE_URL}/contact.json`;


// localstate
const state={
    ContactArr:[],
    Edit_id:null
}

// Snakbar
function Snakbar(msg,icon){
    Swal.fire({
        title:msg,
        icon:icon,
        timer:2500,
    
    })
}

// spinner
function Handlespinner() {
    spinner.classList.toggle("d-none")
    
}

// objtoArr
function ObjToArr(obj){
    state.ContactArr=[];
    for(const key in obj){
        obj[key].id =key;
        state.ContactArr.unshift(obj[key]);
    }

}

// templating
function templating(arr){
    let result=``;
    arr.forEach(ele => {
        result+=`
        <li class="list-group-item d-flex justify-content-between align-items-center" id=${ele.id}>
                    <strong>${ele.contact}</strong>
                    <div>
                    <i onclick="Onedit(this)"  class="fa-regular fa-pen-to-square fa-2x text-primary"></i>
                    <i onclick="OnDeletet(this)"  class="fa-solid fa-trash-can fa-2x text-danger"></i>
                    </div>
                </li>`
        
    });
    list.innerHTML=result;
}


function ShowAlllist(){
    Handlespinner();
    fetch(CONTACT_URL,{
        method:"GET",
        body:null,
        headers:{
            "content-Type":"application/json",
            "Authorization":"TOKEN JWT FROM  LS"

        }
    })
    .then(res=>{
        if(!res.ok){
            throw new Error(`HTTP ERROR:${res.status}`);
            }
            return res.json();

    })
    .then(data=>{
        cl(data)
        ObjToArr(data);
        templating(state.ContactArr);

    })
    .catch(err=>{
        cl(err)
    })
    .finally(()=>{
        Handlespinner();
    })

}
ShowAlllist();




// create
function CreateList(eve){
    Handlespinner();
    eve.preventDefault();
    let obj={
        contact:formInput.value.trim()
    }
    fetch(CONTACT_URL,{
        method:"POST",
        body:JSON.stringify(obj),
        headers:{
            "content-Type":"application/json",
            "Authorization":"TOKEN JWT FROM  LS"


        }
    })
    .then(res=>{
        if(!res.ok){
            throw new Error(`HTTP ERROR:${res.status}`)
        }
        return res.json();

    })
    .then(data=>{
        let li= document.createElement("li");
        li.id=data.name;
        li.className="list-group-item d-flex justify-content-between align-item center"
        li.innerHTML=`
                <strong>${obj.contact}</strong>
                    <div>
                    <i onclick="Onedit(this)" class="fa-regular fa-pen-to-square fa-2x text-primary"></i>
                    <i onclick="OnDeletet(this)" class="fa-solid fa-trash-can fa-2x text-danger"></i>
                    </div>`
                   
                   
                   
                    list.append(li);
                     Snakbar("Your List Created sucsessfully!!","success")

                    form.reset();

    })
    .catch(err=>{
        cl(err)

    })
    .finally(()=>{
        Handlespinner();
    })

}




// edit
function Onedit(e){
    Handlespinner();
    let EDIT_ID=e.closest("li").id;
    state.Edit_id=EDIT_ID;
    let Edit_url=`${BASE_URL}/contact/${EDIT_ID}.json`
    fetch(Edit_url,{
        method:"GET",
        body:null,
        headers:{
            "content-Type":"application/json",
            "Authorization":"TOKEN JWT FROM  LS"

        }
    })
    .then(res=>{
        if(!res.ok){
            throw new Error(`HTTP ERROR ${res.status}`)
        }
        return res.json();
    })
    .then(res=>{
        formInput.value=res.contact;
        submitBtn.classList.add("d-none")
        updateBtn.classList.remove("d-none")


    })
    .catch(err=>{
        cl(err);

    })
    .finally(()=>{
        Handlespinner();

    })
}





function OnUpdatelist(eve){
    Handlespinner();;
    let Update_id=state.Edit_id;
    let Upobj={
        contact:formInput.value,
        id:Update_id
    }
    Update_url=`${BASE_URL}/contact/${Update_id}.json`
    fetch(Update_url,{
        method:"PATCH",
        body:JSON.stringify(Upobj),
        headers:{
            "content-Type":"application/json",
            "Authorization":"TOKEN JWT FROM  LS"
         
        }

    })
    .then(res=>{
        if(!res.ok){
            throw new Error(`HHTP ERROR:${res.status}`)

        }
        return res.json();

    })
    .then(data=>{
        let index=state.ContactArr.findIndex(t=>t.id===Update_id)
        state.ContactArr[index]=data;
        let li=document.getElementById(Update_id)
        li.querySelector("strong").innerText=data.contact
        submitBtn.classList.remove("d-none")
        updateBtn.classList.add("d-none")
        Snakbar(`List Updated sucsessfully with new update ID${Update_id}`,"success")
        form.reset();

    })
    .catch(err=>{
        cl(err)

    })
    .finally(()=>{
        Handlespinner();

    })

}


// DElete
function OnDeletet(ele){
    
    let Remove_Id= ele.closest("li").id;
    Swal.fire({
  title: "Are you sure?",
  text: "You won't be able to revert this!",
  icon: "warning",
  showCancelButton: true,
  confirmButtonColor: "#3085d6",
  cancelButtonColor: "#d33",
  confirmButtonText: "Yes, delete it!"
}).then((result) => {
  if (result.isConfirmed){
        Handlespinner();

    let Remove_url=`${BASE_URL}/contact/${Remove_Id}.json`
    fetch(Remove_url,{
        method:"DELETE",
        body:null,
        headers:{
            "content-Type":"application/json",
            "Authorization":"TOKEN JWT FROM  LS"

        }
    })
    .then(res=>{
        if(!res.ok){
            throw new Error (`HTTP ERROR:${res.status}`)
        }
        return res.json();
    })
    .then(data=>{
        let Getindex= state.ContactArr.findIndex(d=>d.id===Remove_Id);
        state.ContactArr.splice(Getindex,1);
        ele.closest("li").remove();
        Snakbar("Your Item remove sucsessfully!!","success")


    })
    .catch(err=>{
        cl(err)

    })
    .finally(()=>{
        Handlespinner();
    })

  }
})
}
    

    
    
    
    
    
    




form.addEventListener("submit",CreateList);
updateBtn.addEventListener("click",OnUpdatelist);