import { initializeApp } from "firebase/app";
import { getVertexAI, getGenerativeModel } from "firebase/vertexai-preview";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

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
    isTokenAutoRefreshEnabled: true
});

const vertexAI = getVertexAI(firebaseApp);

const model = getGenerativeModel(vertexAI, { model: "gemini-1.5-flash" });

let syllabusData = null;



async function fetchSyllabus(filePath) { 
    // Find the file in Firebase Storage
    const storage = getStorage(firebaseApp);
    const fileRef = ref(storage, filePath);

    // Fetch the located file
    const downloadURL = await getDownloadURL(fileRef);
    const response = await fetch(downloadURL);

    // Load the file as a blob, then construct a promise to convert it to base64
    const fileBlob = await response.blob();
    
    const base64Promise = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result.split(",")[1];
            resolve(base64String);
        };
        reader.onerror = reject;
        reader.readAsDataURL(fileBlob);
    });

    return base64Promise;
}

window.fetchSyllabus = fetchSyllabus;

// Parse markdown-style text formatting into HTML
function parseTextStyle(text) {
    const boldRegex = /\*\*(.*?)\*\*/g;
    const italicRegex = /\*(.*?)\*/g;
    const underlineRegex = /__(.*?)__/g;
    const strikethroughRegex = /~~(.*?)~~/g;

    if (typeof text === "string") {
        text = text.replace(boldRegex, "<b>$1</b>");
        text = text.replace(italicRegex, "<i>$1</i>");
        text = text.replace(underlineRegex, "<u>$1</u>");
        text = text.replace(strikethroughRegex, "<s>$1</s>");
    }
    
    return text;
}

// Return the date of the Monday of the current week
function weekOfDate(startOfWeek) {
    const today = new Date();
    const weekOfDate = new Date(today.setDate(today.getDate() - (today.getDay() - 1)));

    //Convert to string
    const weekOfDateString = weekOfDate.toLocaleDateString();
    return weekOfDateString;
}
    

async function runModel(textPrompt) {
    const result = await model.generateContentStream(
        [
            { 
                inlineData: { 
                    data: await syllabusData, 
                    mimeType: "application/pdf" 
                }
            },
            `Your name is SyllabusBot, and you are a chatbot that can answer questions about the syllabus. You can answer questions about the course schedule, assignments, exams, grading, and other course-related topics. You will be provided a syllabus in PDF format, and you will answer questions based on the content of the syllabus. The current date is: ${new Date().toLocaleDateString()}. It is the week of the ${weekOfDate()}.`,
            textPrompt
        ]
    );

    for await (const chunk of result.stream) {
        createChatStream(chunk.text(), "right");
    }

    endChatStream();
}

function createChatText(text, direction) {
    const chatDiv = document.getElementById("chatDiv");
    const chatText = document.createElement("p");
    
    chatText.innerHTML = parseTextStyle(text);
    chatText.style.textAlign = direction;

    chatDiv.appendChild(chatText);
}

function createChatStream(chunk, direction) {
    const chatDiv = document.getElementById("chatDiv");

    if (document.getElementById("chunkedText") === null) {
        const chunkedText = document.createElement("p");
        
        chunkedText.innerHTML += parseTextStyle(chunk);
        chunkedText.style.textAlign = direction;
        chunkedText.id = "chunkedText";

        chatDiv.appendChild(chunkedText);
    } else {
        const chunkedText = document.getElementById("chunkedText");
        chunkedText.innerHTML += parseTextStyle(chunk);
    }
}

function endChatStream() {
    const chunkedText = document.getElementById("chunkedText");
    chunkedText.id = null;
}

document.addEventListener("DOMContentLoaded", () => {
    const messageBox = document.getElementById("messageInput");
    messageBox.focus();

    function sendUserPrompt() {
        const messageText = messageBox.value;
        messageBox.value = "";
    
        createChatText(messageText, "left");
    
        runModel(messageText);
    }

    syllabusData = fetchSyllabus("MATH108170.pdf");

    // Trigger on user pressing enter
    messageBox.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            sendUserPrompt();
        }
    });

    // Add the function to the global scope so it can be called via HTML
    window.sendUserPrompt = sendUserPrompt;
});