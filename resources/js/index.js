const nameInput = document.getElementById("my-name-input");
const myMessage = document.getElementById("my-message");
const sendButton = document.getElementById("send-button");
const chatBox = document.getElementById("chat");
const saveUsernameButton=document.getElementById("save-username-button");
const MILLISECONDS_IN_TEN_SECONDS = 10000;
const serverURL = `https://it3049c-chat-application.herokuapp.com/messages`;

function fetchMessages(){
  return fetch(serverURL).then( response => response.json())
}

async function updateMessages() {
  // Fetch Messages
  const messages = await fetchMessages();
  // Loop over the messages. Inside the loop we will:
      // get each message
      // format it
      // add it to the chatbox
  let formattedMessages = "";
  messages.forEach(message => {
      formattedMessages += formatMessage(message, localStorage.getItem("userName"));
  });
  chatBox.innerHTML = formattedMessages;
}

setInterval(updateMessages,MILLISECONDS_IN_TEN_SECONDS);
updateMessages();

function formatMessage(msg,myNameInput){

  let time=new Date(msg.timestamp);
  let timeStamp=`${time.getHours()}:${time.getMinutes()}`;
  var b=myNameInput==msg.sender;
  return `
    <div class="${b? "mine":"yours"} messages">
      <div class="message">
        ${msg.text}
      </div>
      <div class="sender-info">
        ${b? "":msg.sender} ${timeStamp}
      </div>
    </div>
  `;
}


function sendMessages(username, text) {
  if(myMessage.disabled)
    return;
  const newMessage = {
      sender: username,
      text: text,
      timestamp: new Date()
  }

  fetch (serverURL, {
      method: `POST`, 
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(newMessage)
  });
}

sendButton.addEventListener("click", function(sendButtonClickEvent) {
  sendButtonClickEvent.preventDefault();
  const sender = nameInput.value;
  const message = myMessage.value;

  sendMessages(sender,message);
  myMessage.value = "";
});
function checkStorage(){

  let localUserName=localStorage.getItem("userName");
  console.log(localUserName)
  if(localUserName!=null){
    myMessage.disabled=false;
    nameInput.value=localUserName;
  }else{
    nameInput.value="";
    myMessage.disabled=true;
  }
}
checkStorage();

saveUsernameButton.addEventListener("click",function(){
  if(nameInput.value==""){
    alert("Username cannot be empty.");
  }else{
    localStorage.setItem("userName",nameInput.value);
    myMessage.disabled=false;
    alert("Username Saved!");

  }
});
