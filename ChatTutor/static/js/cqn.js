// Constants for embed mode and UI elements
import {lightMode, darkMode, setProperties} from "./constants.js";
import {alert} from "./nicealert.js"
import { clearFileInput } from "./fileupload.js";
import { JSONparse } from "./jsonparse.js";
// import { setFromDoc, clearFromDoc } from "./from_doc_ext.js";
const embed_mode = false;
const clear = document.getElementById('clearBtnId');
const clearContainer = get('.clear-btn-container');
const mainArea = get('.msger');
const msgerForm = get(".msger-inputarea");
const msgerInput = get(".msger-input");
const msgerChat = get(".msger-chat");

// Constants for bot and person details
const BOT_IMG = "https://static.thenounproject.com/png/2216285-200.png";
const PERSON_IMG = "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/1024px-Default_pfp.svg.png";
const BOT_NAME = "ChatTutor";
const PERSON_NAME = "Student";

// URLs for production and debugging
const prodAskURL = new URL("https://chattutor-393319.ue.r.appspot.com/ask");
const debugAskURL = new URL("http://127.0.0.1:5000/ask");

// Variables to hold conversation and message details
var conversation = [];
var original_file = "";
let lastMessageId = null;
var stopGeneration = false
let selectedModel = document.getElementById('modelDropdown').value

// Get the send button
const sendBtn = document.getElementById('sendBtn');
const themeBtn = document.getElementById('themeBtn')
const themeBtnDiv = document.getElementById('themeBtnDiv')
const messageInput = document.getElementById('msgInput')
const scrollHelper = document.getElementById('scrollHelper')
const stopGenButton = document.getElementById('stopBtnId')
const uploadZipButton = document.getElementById('uploadBtnId')
const sendUploadedZipButton = document.getElementById('sendformupload')
const uploadZipPapersForm = document.getElementById('uploadFileForm')
const selectUploadedCollection = document.getElementById('selectUploadedCollection')
const clearformupload = document.getElementById("clearformupload")
const modelDropdown = document.getElementById('modelDropdown')
const messageDIVInput = document.getElementById('msgInputDiv')
let uploadedCollections = []
messageInput.addEventListener('input', (event) => {
  console.log(messageInput.value.length)
  sendBtn.disabled = messageInput.value.length === 0 ;
  clear.disabled = !(messageInput.value.length === 0 );
})

function isQueueEmpty(){
  const queue_status = document.getElementById("queue_status");
  return queue_status.innerHTML === ""
}

async function getDocsFromCollection(){
  const collectionMameDoc = document.getElementById("collection_name_doc");
  let data = {
    collection_name: "cqn_reports"
  }
  let response = await fetch('/get_doc_list', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data)})
  let res_json = await response.json()

  let innerHTML = ""
  for (let doc of res_json){
    innerHTML+=`<a href='/cqn/${data.collection_name}/${doc.doc}'><b>${doc.dockey}</b></a> - ${doc.title} - <a href='/delete_doc_from_collection/cqn_reports/${doc.doc}'>delete</a><br>`
  }
  collectionMameDoc.innerHTML = innerHTML
}

async function getQueueStatus(){
  let response = await fetch('/get_queue_progress')
  let progress = await response.json()
  const queue_status = document.getElementById("queue_status");
  let new_html = ""
  if (progress[0] === progress[1]){
    new_html = ""
  }else{
    new_html = `(progress bar - ${progress[0]}/${progress[1]})`
  }
  if (queue_status.innerHTML != new_html){
    getDocsFromCollection()
  }
  queue_status.innerHTML = new_html
  setTimeout(getQueueStatus, 5000)
}

window.addEventListener('load', function() {
  getQueueStatus()
  getDocsFromCollection()
})




stopGenButton.style.display = 'none'
// Listen for windoe resize to move the 'theme toggle button
window.addEventListener('resize', windowIsResizing)

function windowIsResizing() {
  console.log("resize")
    // the button for choosing themes snaps in place when the window is too small
  if(window.innerWidth < 1200) {
      themeBtnDiv.style.position = 'inherit'
      themeBtnDiv.style.top = '25px'
      themeBtnDiv.style.left = '25px'

      const arr = document.querySelectorAll('.theme-button')
      console.log(arr)
      arr.forEach(btn => {
        btn.style.backgroundColor = 'transparent'
        btn.style.color = 'var(--msg-header-txt)'
        btn.style.textDecoration = 'underline'
        btn.style.padding = '0'
        btn.style.boxShadow = 'none'
        btn.style.border = 'none'
        btn.style.borderRadius = '0px'
        btn.style.margin = '0'

        btn.style.height = 'unset'
        btn.style.width = 'unset'
      })

  } else {
      themeBtnDiv.style.position = 'fixed'
      themeBtnDiv.style.top = '25px'
      themeBtnDiv.style.left = '25px'
      const arr = document.querySelectorAll('.theme-button')
      console.log(arr)
      arr.forEach(btn => {
        btn.style.backgroundColor = 'rgb(140, 0, 255)'
        btn.style.color = 'white'
        btn.style.textDecoration = 'none'
        btn.style.padding = '10px'
        btn.style.boxShadow = '0 5px 5px -5px rgba(0, 0, 0, 0.2)'
        btn.style.border = 'var(--border)'
        btn.style.borderRadius = '50%'
        btn.style.margin = '0'
        btn.style.height = '40px'
        btn.style.width = '40px'
      })
  }
}

function getFormattedIntegerFromDate() {
    let d = Date.now()

}

const smallCard = {
  card_max_width: '867px'
}

const bigCard = {
  card_max_width: 'unset'
}

let theme = null
let interfaceTheme = null

// Configures UI
if(embed_mode) {
  setupEmbedMode();
}

function uploadMessageToDB(msg, chat_k) {
    if(msg.content === "") {
        return
    }
    const data_ = {content: msg.content, role: msg.role, chat_k: chat_k, time_created: `${Date.now()}`, clear_number: getClearNumber()}
    console.log(`DATA: ${JSON.stringify(data_)} `)
    fetch('/addtodb', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data_)})
        .then(() =>{
            console.log('Andu')
        })
}

// Event listener to clear conversation
clear.addEventListener('click', clearConversation);

// Event listener to handle form submission
msgerForm.addEventListener("submit", handleFormSubmit);

// Event listener to load conversation from local storage on DOM load
document.addEventListener("DOMContentLoaded", loadConversationFromLocalStorage);
// REMVE ALL from collections saved in local storage + clean up local storage
document.addEventListener("DOMContentLoaded", clearCollectionsFromLocalStorage)

document.addEventListener('DOMContentLoaded', setThemeOnRefresh)

document.addEventListener('DOMContentLoaded', windowIsResizing)

// Event listener for toggling the theme
themeBtn.addEventListener('click', toggleDarkMode)

stopGenButton.addEventListener('click', stopGenerating)

modelDropdown.addEventListener('change', handleModelDropdownChange);

function handleModelDropdownChange(event) {
  selectedModel = event.target.value;
  console.log("Selected model:", selectedModel);
}



// I dodn't know if i should install uuidv4 using npm or what should i use
function uuidv4() {
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}

function setChatId() {
    localStorage.setItem('conversation_id', uuidv4())
}

function getChatId() {
    return localStorage.getItem('conversation_id')
}

function increaseClearNumber() {
    let clnr = getClearNumber()
    let clear_number = parseInt(clnr)
    localStorage.setItem('clear_number', `${clear_number+1}`)
}

function resetClearNumber() {
    localStorage.setItem('clear_number', '0')
}

function getClearNumber() {
    return localStorage.getItem('clear_number')
}

function reinstantiateChatId() {
    increaseClearNumber()
}

// function for keeping the theme whn the page refreshes
function setThemeOnRefresh() {
  // disable send button
  sendBtn.disabled = messageInput.value.length === 0;
  if(getChatId() == null) {
    setChatId()
  }

  if(getClearNumber() == null) {
      resetClearNumber()
  }

  theme = localStorage.getItem('theme')
  if (theme == null) {
    setTheme('dark')
  } else {
    setTheme(theme)
  }

  interfaceTheme = 'normal'
  setTheme('normal')

}
// helper function
function setTheme(th) {
  setProperties()
  const _style = "\"font-size: 15px !important; padding: 0 !important; margin: 0 !important; vertical-align: middle\""
    themeBtn.innerHTML = theme === "dark" ? `<span class="material-symbols-outlined" style=${_style}> light_mode </span>` :
        `<i class="material-symbols-outlined" style=${_style}> dark_mode\n </i>`
}

// function that toggles theme
function toggleDarkMode() {
  if (theme === 'light') {
    theme = 'dark'
  } else if(theme === 'dark') {
    theme = 'light'
  } else {
    theme = 'dark'
  }
  localStorage.setItem('theme', theme)
  setTheme(theme)
}

function toggleInterfaceMode() {
  interfaceTheme = 'normal'
  localStorage.setItem('interfacetheme', interfaceTheme)
  setTheme(interfaceTheme)

}

function clearConversation() {
  conversation = [];
  localStorage.setItem("cqn-conversation", JSON.stringify([]));
    reinstantiateChatId()
  var childNodes = msgerChat.childNodes;
  for(var i = childNodes.length - 3; i >= 2; i--){
      var childNode = childNodes[i];
      if (childNode.id !== 'clearContId' && childNode.id !== 'clearBtnId') {
        childNode.parentNode.removeChild(childNode);
      }
  }
}

function stopGenerating() {
  stopGeneration = true
  sendBtn.disabled = messageInput.value.length == 0;
  clear.disabled = !(messageInput.value.length == 0);
}


function loadConversationFromLocalStorage() {
  let conversation = JSON.parse(localStorage.getItem("cqn-conversation"))
  if(conversation){
    conversation.forEach(message => {
      lastMessageId = null
      addMessage(message["role"], message["content"], false, message["context_documents"])
      if (message["context_documents"]) {
        //setLatMessageHeader(message["context_documents"])
      }
    })
  }
  else conversation = []
  MathJax.typesetPromise();
}

function loadCollectionsFromLocalStorage() {
  const collections = JSON.parse(localStorage.getItem("uploaded-collections"))//TODO
  if(collections) {
    collections.forEach(collname => {
      addCollectionToFrontEnd(collname)
    })
  }
}

function clearCollectionsFromLocalStorage() {
  let collections = JSON.parse(localStorage.getItem("uploaded-collections"))
  if(collections) {
    collections.forEach(collname => {
      fetchClearCollection(collname)
    })
  }
}

function fetchClearCollection(collname) {
  console.log("clearing ", collname)
  let args = {
    "collection":collname
  }
  fetch("/delete_uploaded_data", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(args)
  }).then(response => response.json()).then(data => {
    console.log("deleted " + data["deleted"])
  })
}




function queryGPT(fromuploaded=false, uploaded_collection_name="test_embedding") {
  const collection_name = document.getElementById("collection_name");
  const args = {
    "conversation": conversation,
    "multiple": true,
    "collection": [collection_name.value]
  }

  const from_doc =  document.getElementById("from_doc");
  if (from_doc.value && from_doc.value!= "None"){
    args.from_doc = from_doc.value    
  }
  console.log("from_doc", from_doc.value)
  console.log("collection", args.collection)

  args.selectedModel = selectedModel
  document.querySelector(".loading-message").style = "display: flex;"
  fetch('/ask', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(args)
  }).then(response => {
    const reader = response.body.getReader();
    let accumulatedContent = "";
    let isFirstMessage = true;
    let context_documents = null;
    function read() {
      reader.read().then(({ done, value }) => {
        if (done) {
          // Enable the send button when streaming is done
          sendBtn.disabled = messageInput.value.length === 0;
          clear.style.display = 'block'
          stopGenButton.style.display = 'none'
          stopGeneration = false
            uploadMessageToDB({content: accumulatedContent, role: 'assistant'}, getChatId())
          return;
        }
        const strValue = new TextDecoder().decode(value);
        const messages = strValue.split('\n\n').filter(Boolean).map(chunk => JSONparse(chunk.split('data: ')[1]));
          let message;
          for (var messageIndex in messages) {
              message = messages[messageIndex]
              if (stopGeneration === false) {
                  if (message.message.valid_docs) {
                    context_documents = message.message.valid_docs
                    console.log(context_documents)
                  }
                  const contentToAppend = message.message.content ? message.message.content : "";
                  accumulatedContent += contentToAppend;
              }
              if (isFirstMessage) {
                console.log("added", accumulatedContent)
                addMessage("assistant", accumulatedContent, false);
                setLatMessageHeader(context_documents)
                isFirstMessage = false;
              } else {
                console.log('message',message.message)
                  if (typeof (message.message.content) == 'undefined') {
                      conversation.push({"role": 'assistant', "content": accumulatedContent, "context_documents" : context_documents})
                      localStorage.setItem("cqn-conversation", JSON.stringify(conversation))
                  }
                  console.log("updated", accumulatedContent)

                  scrollHelper.scrollIntoView()
                  updateLastMessage(accumulatedContent);

                  if (message.message.error) {
                    conversation.push({"role": 'assistant', "content": accumulatedContent})
                    localStorage.setItem("cqn-conversation", JSON.stringify(conversation))
                  }
              }
              if (stopGeneration === true) {
                  accumulatedContent += " ...Stopped generating";
                  conversation.push({"role": 'assistant', "content": accumulatedContent, "context_documents" : context_documents})
                  localStorage.setItem("cqn-conversation", JSON.stringify(conversation))

                  sendBtn.disabled = messageInput.value.length == 0;
                  clear.disabled = !(messageInput.value.length == 0);
                  clear.style.display = 'block'
                  stopGenButton.style.display = 'none'
                  uploadMessageToDB({content: accumulatedContent, role: 'assistant'}, getChatId())
                  scrollHelper.scrollIntoView()
                  updateLastMessage(accumulatedContent);

                  break
              }
          }
        if(stopGeneration === false) {
          read();
        } else {
          stopGeneration = false

        }
        document.querySelector(".loading-message").style = "display: none;"
      }).catch(err => {
        console.error('Stream error:', err);
        sendBtn.disabled = false;
        clear.style.display = 'block'
        stopGenButton.style.display = 'none'
        stopGeneration = false
        document.querySelector(".loading-message").style = "display: none;"

      });
      MathJax.typesetPromise();
    }
    read();
    // MathJax.typesetPromise();
    document.querySelector(".loading-message").style = "display: none;"

  }).catch(err => {
    console.error('Fetch error:', err);
    // Enable the send button in case of an error
    sendBtn.disabled = false;
    clear.style.display = 'block'
    stopGenButton.style.display = 'none'
    stopGeneration = false
    document.querySelector(".loading-message").style = "display: none;"

  });
}

function formatMessage(message, makeLists = true) {
  const messageArr = message.split("\n")

  let messageStr = ""
  let listSwitch = 0
  for (let messageArrIndex in messageArr) {
    const paragraph = messageArr[messageArrIndex]
    if(paragraph.startsWith('- ') && makeLists) {
      if(listSwitch === 0) {
        messageStr += "<ul style=\"padding-left: 15px !important;\">"
      }

      messageStr += `<li><p>${paragraph.slice(2)}</p></li>`

      listSwitch = 1

    } else if (listSwitch === 1) {
      messageStr += "</ul>"
      messageStr += `<p>${paragraph}</p>`
      listSwitch = 0
    } else {
      messageStr += `<p>${paragraph}</p>`
      listSwitch = 0
    }

  }
  return messageStr
}


function setLatMessageHeader(context_documents, lastMessageIdParam, add=true) {

  if (context_documents==false)
    return ''
  if (!lastMessageIdParam) {
    lastMessageIdParam = lastMessageId
  }
  if (add == false) {
    var docs = ''
      context_documents.forEach(doc => {
        // TO not break HTML
        doc.metadata["summary"] = 0

        var data = `${JSON.stringify(doc.metadata).replace("&quot;", '"')}`
        docs += `<div class="msg-context-doc col ${lastMessageIdParam}-context" data-doc="${doc.metadata.doc}">
          <div style="align-self: self-start;">
            <span>${doc.metadata.doc}</span>
          </div>

          <div class="info col">
            <div>
              <div class="askmore context-info col" onclick='setFromDoc(${data})'>Ask about</div>
              <div class="inform context-info col" onclick='setDocInfo(${data})'>Info</div>
            </div>
          </div>
        </div>`
      })
      return docs;
  }


  if (lastMessageIdParam) {
    const lastMessageElement = document.querySelector(`#${lastMessageIdParam} .msg-text`);
    if (lastMessageElement) {
      var docs = ''
      context_documents.forEach(doc => {
        docs += `<div class="msg-context-doc col ${lastMessageIdParam}-context" data-doc="${doc.metadata.doc}">
          <div style="align-self: self-start;">
            <span>${doc.metadata.doc}</span>
          </div>

          <div class="info col">
            <div>
              <div class="askmore context-info col" onclick='setFromDoc(${JSON.stringify(doc.metadata)})'>Ask about</div>
              <div class="inform context-info col" onclick='setDocInfo(${JSON.stringify(doc.metadata)})'>Info</div>
            </div>
          </div>
        </div>`
      })
      if (add)
      document.querySelector(`#${lastMessageIdParam}`).innerHTML = `
        <div class="msg-header-context">${docs}</div>
        ${document.querySelector(`#${lastMessageIdParam}`).innerHTML}
      `;

      return docs
    } else {
      console.error('Cannot find the .msg-text element to update.');
    }
  } else {
    console.error('No message has been added yet.');
  }

  return ''
}

function updateLastMessage(newContent) {
  if (lastMessageId) {
    const lastMessageElement = document.querySelector(`#${lastMessageId} .msg-text`);
    if (lastMessageElement) {
      const newContentFormatted = formatMessage(newContent)
      document.querySelector(`#${lastMessageId} .msg-text`).innerHTML = newContentFormatted;
    } else {
      console.error('Cannot find the .msg-text element to update.');
    }
  } else {
    console.error('No message has been added yet.');
  }
  // MathJax.typesetPromise();

}

clearformupload.addEventListener("click", ()=>{
  clearFileInput(document.querySelector("#upload"))
})



function addMessage(role, message, updateConversation, lastmessageheader=false) {
    let role_name
    let img
    let side

  if(role === "assistant") {
    role_name = BOT_NAME;
    img = BOT_IMG;
    side = "left";

  }
  else {
    role_name = PERSON_NAME;
    img = PERSON_IMG;
    side = "right";
  }

  const messageId = 'msg-' + new Date().getTime();
  lastMessageId = messageId;

  // if you want to make the robot white ( of course it doesn't work well in safari ), so -- not in use right now
  var invertImage = 'invert(0%)'
  if (side === "left") {
    invertImage = 'var(--msg-invert-image)'
  }

  const messageStr = formatMessage(message, role === "assistant")

  const msgHTML = `
    <div class="msg ${side}-msg" id="${messageId}">
    <div class="msg-header-context">${setLatMessageHeader(lastmessageheader, messageId, false)}</div>

    <div class="msg-bgd">
      <div class="msg-img" style="background-image: url(${img})"></div>

      <div class="msg-bubble">
        <div class="msg-info">
          <div class="msg-info-name">${role_name}</div>
          <div class="msg-info-time">${formatDate(new Date())}</div>
        </div>

        <div class="msg-text">${messageStr}</div>
      </div>
      </div>
    </div>
  `;

  clearContainer.insertAdjacentHTML("beforebegin", msgHTML);

  // Find the newly added message and animate it
  const newMessage = document.getElementById(messageId);
  newMessage.style.opacity = "0";
  newMessage.style.transform = "translateY(1rem)";

  // MathJax.typesetPromise([newMessage]);
  
  // Trigger reflow to make the transition work
  void newMessage.offsetWidth;
  
  // Start the animation
  newMessage.style.opacity = "1";
  newMessage.style.transform = "translateY(0)";
  msgerChat.scrollTop += 500;
  if(updateConversation){
    conversation.push({"role": role, "content": message})
    localStorage.setItem("cqn-conversation", JSON.stringify(conversation))
  }

}


function setupEmbedMode() {
  // Setup minimize and expand buttons to toggle 'minimized' class on mainArea
  const minimize = get('.msger-minimize');
  const expand = get('.msger-expand');
  minimize.addEventListener('click', () => mainArea.classList.toggle('minimized'));
  expand.addEventListener('click', () => mainArea.classList.toggle('minimized'));

  // Extract and store the name of the original file from the 'Download source file' link
  const download_original = document.querySelectorAll('[title="Download source file"]')[0];
  original_file = download_original.getAttribute("href").slice(download_original.getAttribute("href").lastIndexOf("/") + 1);
}


// Utility functions
function get(selector, root = document) {
  return root.querySelector(selector);
}

function formatDate(date) {
  const h = "0" + date.getHours();
  const m = "0" + date.getMinutes();

  return `${h.slice(-2)}:${m.slice(-2)}`;
}


export function uploadFile() {
  let myFormData = new FormData(uploadZipPapersForm)
  const formDataObj = {};
  myFormData.forEach((value, key) => (formDataObj[key] = value));
  console.log(formDataObj)

  sendUploadedZipButton.querySelector("span").innerHTML = `<img src="./images/loading.gif" style="width: 40px; height: 40px;">`

  console.log(formDataObj["file"])
  if (formDataObj["file"]["name"] == '') {
    alert("Please upload a file!")
    sendUploadedZipButton.querySelector("span").innerHTML = "upload"

    return
  }

  fetch('/upload_data_to_process', {
    method: 'POST',
    body: new FormData(uploadZipPapersForm)
  }).then(response => response.json()).then(data => {
    let created_collection_name = data['collection_name']
    console.log("Created collection " + created_collection_name)
    if (created_collection_name == false || created_collection_name == "false") {
      alert("Select file")
    } else {
      addCollectionToFrontEnd(created_collection_name)

    }



    sendUploadedZipButton.querySelector("span").innerHTML = "upload"
    clearFileInput(document.querySelector("#upload"))
  })
}

function addCollectionToFrontEnd(created_collection_name) {
  uploadedCollections.push(created_collection_name)
  console.log(uploadedCollections)
    selectUploadedCollection.innerHTML += `
      <option value=${created_collection_name}>${created_collection_name.split("_")[0]}:collection</option>
    `
    localStorage.setItem("uploaded-collections", JSON.stringify(uploadedCollections))
  alert(`Created collection ${created_collection_name}`)
}

if (sendUploadedZipButton)
sendUploadedZipButton.addEventListener("click", uploadFile)


function hasClass(ele, cls) {
  return !!ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
}

function addClass(ele, cls) {
  if (!hasClass(ele, cls)) ele.className += " " + cls;
}

function removeClass(ele, cls) {
  if (hasClass(ele, cls)) {
      var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
      ele.className = ele.className.replace(reg, ' ');
  }
}

//Add event from js the keep the marup clean
function init() {
  document.getElementById("open-menu").addEventListener("click", toggleMenu);
  document.getElementById("body-overlay").addEventListener("click", toggleMenu);
}

//The actual fuction
function toggleMenu() {
  var ele = document.getElementsByTagName('body')[0];
  if (!hasClass(ele, "menu-open")) {
      addClass(ele, "menu-open");
  } else {
      removeClass(ele, "menu-open");
  }
}

//Prevent the function to run before the document is loaded
document.addEventListener('readystatechange', function() {
  if (document.readyState === "complete") {
      init();
  }
});



document.querySelector(".close-notif").addEventListener('click', e => {
  clearFromDoc();
})



document.querySelector(".close-arxiv").addEventListener('click', e => {
  clearDocInfo();
})

// -------- inchat

const addUrlButton = document.getElementById('addUrl')
let file_array_to_send = undefined
let collectionName = undefined
const msgerDiv = document.getElementById('msgInputDiv')
function setNewCollection() {
    collectionName = `${uuidv4()}`.substring(0,10)
}

setNewCollection()

async function uploadSiteUrl() {
    let str = validateUrls()
    addUrlButton.innerText = 'Adding urls...'
    if (str === undefined) {
        return;
    }

    let data_ = {url: str, name: collectionName}
    let response = await fetch('/upload_site_url', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data_)})
    let res_json = await response.json()
    console.log('Created collection', res_json)
    let created_collection_name = res_json['collection_name']
    console.log("Created collection " + created_collection_name)
    addUrlButton.innerText = 'Done adding urls'
    return res_json

}


let the_file_arr = undefined

msgerDiv.addEventListener('drop', e => {
    e.preventDefault()
    const transfer = e.dataTransfer
    const files = transfer.files
    if (the_file_arr === undefined) {
        the_file_arr = [...files]
    } else {
        the_file_arr = [...the_file_arr, ...files]
    }

    const the_files = [...files]
    for (const ind in the_files) {
        const file = the_files[ind]
        msgerDiv.innerHTML += ` :file: ${file.name} `
    }
    updateEditor()
})

function validateUrls() {
    let arr = []
    if (msgerInput.value.includes(':url:') || msgerInput.value.includes(':file:')) {

    } else {
        return undefined
    }
    console.log(msgerInput.value)
    var inputval = msgerInput.value
    console.log(inputval)

    let strs = inputval.split(' ')
    console.log(strs)
    let sw = 0
    var index = 0
    while (index < strs.length) {
        const _str = strs[index]

        if (_str === ":url:" && index + 1 < strs.length) {
          arr = [...arr, strs[index + 1]]
        } else if (_str.includes(":url:")) {
          var aux = _str.split(":url:")
          console.log(aux)
          arr = [...arr, aux[1].split('').splice(1).join('')]
        }
        index ++;
        // if(sw == 1 && _str !== ':file:' && _str != ':url:' && _str.length > 3) {
        //     arr = [...arr, _str]
        // }
        // if (_str === ':url:') {
        //     sw = 1
        // } else if(_str === ':file:') {
        //     sw = 0
        // }
    }
    console.log("URL/FILES",arr)
    return arr;


}

function validateMsgInputAndDisable() {
    let str = validateUrls()

    if(str !== undefined) {
         addUrlButton.style.display = 'block'
        addUrlButton.innerText = 'Press enter to add'
        sendBtn.disabled = true

        
    } else {

        addUrlButton.style.display = 'none'
        sendBtn.disabled = false
    }
    sendBtn.disabled = messageInput.value.length === 0 ;
    clear.disabled = !(messageInput.value.length === 0 );


}

function inputTextDidChange() {
    let inner = msgerInput.innerHTML
    validateMsgInputAndDisable()
    console.log('val:', msgerInput.value)
}

msgerInput.addEventListener('input', inputTextDidChange)



// EO New code


function getTextSegments(element) {
    const textSegments = [];
    Array.from(element.childNodes).forEach((node) => {
        switch(node.nodeType) {
            case Node.TEXT_NODE:
                textSegments.push({text: node.nodeValue, node});
                break;

            case Node.ELEMENT_NODE:
                textSegments.splice(textSegments.length, 0, ...(getTextSegments(node)));
                break;

            default:
                throw new Error(`Unexpected node type: ${node.nodeType}`);
        }
    });
    return textSegments;
}

function updateEditor() {

    const sel = window.getSelection();
    const textSegments = getTextSegments(msgerDiv);
    const textContent = textSegments.map(({text}) => text).join('');
    let anchorIndex = null;
    let focusIndex = null;
    let currentIndex = 0;
    textSegments.forEach(({text, node}) => {
        if (node === sel.anchorNode) {
            anchorIndex = currentIndex + sel.anchorOffset;
        }
        if (node === sel.focusNode) {
            focusIndex = currentIndex + sel.focusOffset;
        }
        currentIndex += text.length;
    });

    msgerDiv.innerHTML = renderText(textContent);
    msgerInput.value = msgerDiv.innerText.replaceAll(' ', ' ')

    sendBtn.disabled = messageInput.value.length === 0 ;
    clear.disabled = !(messageInput.value.length === 0 );
    restoreSelection(anchorIndex, focusIndex);

    validateMsgInputAndDisable()
    if(the_file_arr !== undefined) {
        file_array_to_send = the_file_arr.filter((elem) => {
            return msgerInput.value.includes(elem.name)
        })
        console.log(file_array_to_send)
    }
}

function restoreSelection(absoluteAnchorIndex, absoluteFocusIndex) {
    const sel = window.getSelection();
    const textSegments = getTextSegments(msgerDiv);
    let anchorNode = msgerDiv;
    let anchorIndex = 0;
    let focusNode = msgerDiv;
    let focusIndex = 0;
    let currentIndex = 0;
    textSegments.forEach(({text, node}) => {
        const startIndexOfNode = currentIndex;
        const endIndexOfNode = startIndexOfNode + text.length;
        if (startIndexOfNode <= absoluteAnchorIndex && absoluteAnchorIndex <= endIndexOfNode) {
            anchorNode = node;
            anchorIndex = absoluteAnchorIndex - startIndexOfNode;
        }
        if (startIndexOfNode <= absoluteFocusIndex && absoluteFocusIndex <= endIndexOfNode) {
            focusNode = node;
            focusIndex = absoluteFocusIndex - startIndexOfNode;
        }
        currentIndex += text.length;
    });

    sel.setBaseAndExtent(anchorNode,anchorIndex,focusNode,focusIndex);
}


const highlights = [{word: ":url:", col: "#00000043"}, {word: ":file:", col: "#00000040"}]
function renderText(text) {
    var words = text.split(/(\s+)/);
    var arr = new Array()
    var lastf = undefined
    var el = undefined
    var windex = 0
    words.forEach( f=> {
      if (f == ":url:" || f == ":file:" || windex == words.length - 1) {
        if (el !== undefined && lastf !== undefined)
          arr.push(el)
        if (f != undefined)
          arr.push(f)
      } else if (lastf == ":url:" || lastf == ":file:"){
        el = f
      } else {
        el = el + f
      }

      lastf = f
      windex ++
    })
    for (var i = 0; i < arr.length; ++i) {
      arr[i] = arr[i].trim()
    }
    arr = arr.filter(a => a.length > 0)
    console.log("ARRRRRR, ", words, arr, messageInput.value)

    // @Andu, arr does not work :( help
    const output = words.map((word, ind, vec) => {
        for (const ihighlight in highlights) {
            const high = highlights[ihighlight]
            if (word === high.word) {
              if (ihighlight == 0)
                return `</span><span style=\"padding: 1px; margin: 0; margin-right: 5px; border-radius: 2px; background-color: ${high.col}; color: black\">${word}`
            
              return `</span><span style=\"padding: 1px; margin: 0; margin-right: 5px; border-radius: 2px; background-color: ${high.col}; color: black\">${word}`
            }



            if(ind >= 2) {
                if (words[ind - 2] === ":file:" && file_array_to_send !== undefined) {
                    console.log(words[ind-1], file_array_to_send)
                    if(file_array_to_send.some((elem) => {return elem.name === word})) {
                        return `<span style=\"padding: 1px; margin: 0; border-radius: 2px; background-color: #a1e8a1; color: black\">${word}</span>`
                    }
                }
            }
        }
        return word
    })
    return output.join('');
}

msgerDiv.addEventListener('input', updateEditor)

updateEditor()

msgerDiv.onkeydown = function(e) {
    if (e.key === "Enter") {
        e.preventDefault()
        handleFormSubmit_noEvent()
        msgerDiv.innerText = ""
        msgerInput.value = ""

    }
}

async function handleFormSubmit(event) {
  event.preventDefault();
  await handleFormSubmit_noEvent();
}

const COLLECTION_NAME = undefined

async function handleFileUpload() {
    addUrlButton.style.display = 'block'
    addUrlButton.innerText = 'Uploading files...'
    const body = file_array_to_send
    let form_data = new FormData()
    form_data.append('collection_name', collectionName)
    for (const ind in file_array_to_send) {
        form_data.append('file', file_array_to_send[ind])
    }
    const response = await fetch('/upload_data_from_drop', {method: 'POST', headers: {'Accept': 'multipart/form-data'}, body: form_data})

    const coll = await response.json()

    addUrlButton.innerText = 'Done uploading files'
    return coll
}
async function handleFormSubmit_noEvent() {
    const msgText = msgerInput.value;
    if (msgText.startsWith(':url:') || msgText.startsWith(':file:')) {
        let url_array = undefined
        let fil_array = undefined
        if(msgText.includes(':url:')) {
            const s_json = await uploadSiteUrl()
            url_array = s_json['urls']
        }
        if(msgText.includes(':file:') && file_array_to_send !== undefined) {
            const f_json = await handleFileUpload()
            fil_array = f_json['files_uploaded_name']
        }


        if (url_array !== undefined) {
            for (const i in url_array) {
                msgerDiv.innerHTML += `<span style="margin: 0; padding: 0">uploaded_urls: ${url_array[i]} </span>`
            }
        }


         if (fil_array !== undefined) {
            for (const  i in fil_array) {
                msgerDiv.innerHTML += `<span style="margin: 0; padding: 0">uploaded_files: ${fil_array[i]} </span>`
            }
        }


        addCollectionToFrontEnd(collectionName)
        return;
    }
  if (!msgText) return;
  // if (selectUploadedCollection && !selectUploadedCollection.options[ selectUploadedCollection.selectedIndex ]) {
  //   alert("Please upload some files for the tutor to learn from!")
  //   return
  // }

  // Disable the send button
  sendBtn.disabled = true;
  clear.style.display = 'none'
  stopGenButton.style.display = 'block'

  addMessage("user", msgText, true);
  uploadMessageToDB({role: 'user', content: msgText}, getChatId())
  msgerInput.value = "";
  queryGPT();
}
// EO new code