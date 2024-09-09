import { setUserLogHandler } from "@firebase/logger";
import { initializeApp } from "firebase/app";
import { getVertexAI, getGenerativeModel } from "firebase/vertexai-preview";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { send } from "process";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA2E_U5N09zCVHdIecaFuIeDRuUWNX8xNg",
  authDomain: "mysyllabusbot.firebaseapp.com",
  projectId: "mysyllabusbot",
  storageBucket: "mysyllabusbot.appspot.com",
  messagingSenderId: "326497831637",
  appId: "1:326497831637:web:34d6cdc687a3b6a281f05c"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Configure app attestation via reCAPTCHA v3
const appCheck = initializeAppCheck(firebaseApp, {
    provider: new ReCaptchaV3Provider("6LdMDzkqAAAAANzev1MaHzN4MaEcflpuzXgKqQz_"),
  
    // Optional argument. If true, the SDK automatically refreshes App Check
    // tokens as needed.
    isTokenAutoRefreshEnabled: true
});

const vertexAI = getVertexAI(firebaseApp);

const model = getGenerativeModel(vertexAI, { model: "gemini-1.5-flash" });

let syllabusCache = null;

async function fetchSyllabus(fileName) { 
    let base64Data = null;

    const storage = getStorage(firebaseApp);
    const fileRef = ref(storage, "MATH108170.pdf");
    const downloadURL = await getDownloadURL(fileRef);
    const response = await fetch(downloadURL);
    const fileBlob = await response.blob();
    
    if (syllabusCache === null) {
        base64Data = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result.split(",")[1];
                syllabusCache = base64String;
                resolve(base64String);
            };
            reader.onerror = reject;
            reader.readAsDataURL(fileBlob);
        });
    } else {
        base64Data = syllabusCache;
    }

    return base64Data;
}

window.fetchSyllabus = fetchSyllabus;

// Parse markdown-style text formatting into HTML
function parseTextStyle(text) {
    const boldRegex = /\*\*(.*?)\*\*/g;
    const italicRegex = /\*(.*?)\*/g;
    const underlineRegex = /__(.*?)__/g;
    const strikethroughRegex = /~~(.*?)~~/g;

    text = text.replace(boldRegex, "<b>$1</b>");
    text = text.replace(italicRegex, "<i>$1</i>");
    text = text.replace(underlineRegex, "<u>$1</u>");
    text = text.replace(strikethroughRegex, "<s>$1</s>");

    return text;
}
    

async function runModel(prompt) {
    const result = await model.generateContent([{ inlineData: { data: await fetchSyllabus(), mimeType: "application/pdf" }}, prompt]);

    const response = result.response;
    const text = response.text();
  
    return text;
}

function createChatText(text, direction) {
    const chatDiv = document.getElementById("chatDiv");
    const chatText = document.createElement("p");
    
    chatText.innerHTML = parseTextStyle(text);
    chatText.style.textAlign = direction;

    chatDiv.appendChild(chatText);
}

document.addEventListener("DOMContentLoaded", () => {
    const messageBox = document.getElementById("messageInput");
    messageBox.focus();

    function sendUserPrompt() {
        const messageText = messageBox.value;
        messageBox.value = "";
    
        createChatText(messageText, "left");
    
        runModel(messageText).then((response) => {
            createChatText(response, "right");
        });
    }

    // Trigger on user pressing enter
    messageBox.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            sendUserPrompt();
        }
    });

    // Add the function to the global scope so it can be called via HTML
    window.sendUserPrompt = sendUserPrompt;
});