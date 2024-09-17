const typingform = document.querySelector(".typingform");

const chatlist=document.querySelector(".chatlist")

const Api_key="AIzaSyCplR_Itva6FlJYKX8zfnUiDnxOLvXKySw"
const Api_Url=`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${Api_key}`

const showTypingEffect=(text,textelemnt)=>{
const words=text.split(" ")
let currentwordindex=0;
const typinginterval=setInterval(()=>{
textelemnt.innerText+=(currentwordindex===0 ? "" :" ")+words[currentwordindex++]
if(currentwordindex===words.length){
  clearInterval(typinginterval)
}
window.scrollTo(0,chatlist.scrollHeight)
},75)
}

const  generateApiResponse=async(div)=>{
  const textelement=div.querySelector(".text")
  try{
    const response=await fetch(Api_Url,{
      method:"POST",
      headers:{"content-Type":"application/json"},
      body:JSON.stringify({
        contents:[{
          role:"user",
          parts:[{
            text:usermessage
          }]
        }]
      })
    })
    const data=await response.json()
    const apiResponse=data?.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g,'$1')
    console.log(apiResponse);
    showTypingEffect(apiResponse,textelement)
    
    
  }catch(error){
    console.error(error)
  }
  finally{
    div.classList.remove("loading")
  }
}

const copyMessage=(copybtn)=>{
const messageText=copybtn.parentElement.querySelector(".text").innerText;
navigator.clipboard.writeText(messageText)
copybtn.innerText="done"
setTimeout(()=>copybtn.innerText="content_copy",1000)
}

const showloading=()=>{
  const html=`
   <div class="d-flex flex-row  gap-3">
              <img class="align-self-start"  src="./imgs/chatgpt-logo-chat-gpt-icon-on-white-background-free-vector.jpg " alt="avatar">
              <p class="text "></p>


            <div class="loading_indecator  ">
              <div class="loading_bar">
              </div>
              <div class="loading_bar">
              </div>
              <div class="loading_bar">
              </div>
              
            </div>
            </div>
            <span onClick="copyMessage(this)" class="m-4 fs-1   material-symbols-outlined">
              content_copy
              </span>
  `
  const div=document.createElement("div")
  div.classList.add("message","incoming","loading")
  div.innerHTML= html

  chatlist.appendChild(div)

  window.scrollTo(0,chatlist.scrollHeight)

  generateApiResponse(div)
}

const handleOutGoingChat = () => {
  usermessage = document.querySelector(".form-control").value;
  console.log(usermessage);

  if (!usermessage) return;

  const html = `
 <div class="  d-flex flex-row align-items-center  gap-3">
              <img class="align-self-start" src="./imgs/imageuser.jpg  " alt="avatar">
              <p class="text"></p>
            </div>

    `;

    const div=document.createElement("div")
    div.classList.add("message","outgoing")
    div.innerHTML= html

    div.querySelector(".text").innerHTML=usermessage
    chatlist.appendChild(div)
    typingform.reset()
    window.scrollTo(0,chatlist.scrollHeight)
    
    setTimeout(showloading,500)
};

typingform.addEventListener("submit", (e) => {
  e.preventDefault();
  handleOutGoingChat();
});
