import { setUserLogHandler } from "@firebase/logger";
import { initializeApp } from "firebase/app";
import { getVertexAI, getGenerativeModel } from "firebase/vertexai-preview";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";
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

async function runModel(prompt) {
    const imagePart = { fileData: { mimeType: "application/pdf", fileUri: "gs://mysyllabusbot.appspot.com/MATH108170.pdf" }};
    
    const result = await model.generateContent([prompt]);

    const response = result.response;
    const text = response.text();
  
    return text;
}

function createChatText(text, direction) {
    const chatDiv = document.getElementById("chatDiv");
    const chatText = document.createElement("p");
    
    chatText.innerText = text;
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