import { initializeApp } from "firebase/app";
import { getVertexAI, getGenerativeModel } from "firebase/vertexai-preview";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { getFirestore, doc, getDoc } from "firebase/firestore";

import { marked } from 'marked';
import DOMPurify from 'dompurify';

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

let courseInfo = null;

let syllabusData = null;

let chatHistory = [
    {
      role: "user",
      parts: [{ text: "Hello Syllabot!" }],
    }
];

async function fetchCourseInformation() {
    // Get the query string "courseID" from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const schoolID = urlParams.get("schoolID");
    const courseID = urlParams.get("courseID");

    // Fetch the path schools/{schoolID}/courses/{courseID} from Firestore
    const db = getFirestore(firebaseApp);
    const docRef = doc(db, "schools", schoolID, "classes", courseID);

    return (await getDoc(docRef)).data();
}

function parseLists(text) {
    const textLines = text.split("\n");
    const outputLists = [];

    function newOutputList(type, items) {
        outputLists.push({ type: type, items: items });
    }

    function categorizeLine(line) {
        if (line.startsWith("* ")) {
            return "bullet-parent";
        } else if (line.startsWith("  * ")) {
            return "bullet-child";
        } else if (line === "") {
            return "null";
        } else {
            return "text";
        }
    }

    function cleanLine(line) {
        line = line.replace("* ", "");
        line = line.replace("  * ", "");
        return line;
    }

    let previousLine = "";
    let firstLine = true;

    for (let i = 0; i < textLines.length; i++) {
        const currentLine = textLines[i];
        const currentCategory = categorizeLine(currentLine);
        const previousCategory = categorizeLine(previousLine);

        if (firstLine) {
            if (currentCategory === "text") {
                newOutputList("text", [cleanLine(currentLine)]);
            }
            firstLine = false;
        } else {
            if (currentCategory === "bullet-parent") {
                if (previousCategory === "text" || previousCategory === "null") {
                    newOutputList("unordered", [cleanLine(currentLine)]);
                } else if (previousCategory === "bullet-parent") {
                    outputLists[outputLists.length - 1].items.push(cleanLine(currentLine));
                }
            } else if (currentCategory === "bullet-child") {
                if (previousCategory === "bullet-parent") {
                    outputLists[outputLists.length - 1].items.push({ type: "unordered-sub", items: [cleanLine(currentLine)] });
                } else if (previousCategory === "bullet-child") {
                    const lastItem = outputLists[outputLists.length - 1].items;
                    lastItem[lastItem.length - 1].items.push(cleanLine(currentLine));
                }
            } else if (currentCategory === "text") {
                if (previousCategory === "bullet-parent" || previousCategory === "null") {
                    newOutputList("unordered", [cleanLine(currentLine)]);
                } else if (previousCategory === "text") {
                    outputLists[outputLists.length - 1].items.push(cleanLine(currentLine));
                }
            }
        }

        previousLine = currentLine;
    }

    // From outputLists, construct an HTML string
    let outputString = "";
    for (let i = 0; i < outputLists.length; i++) {
        const currentList = outputLists[i];
        if (currentList.type === "text") {
            outputString += `<p>${currentList.items[0]}</p>`;
        } else if (currentList.type === "unordered") {
            outputString += "<ul>";
            for (let j = 0; j < currentList.items.length; j++) {
                outputString += `<li>${currentList.items[j]}</li>`;
            }
            outputString += "</ul>";
        }
    }

    return outputString;
}

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

// Parse markdown-style text formatting into HTML
function renderMarkdownToHtml(markdown) {
    // Use marked to parse markdown to HTML, then sanitize with DOMPurify
    try {
        // marked.parse will convert full markdown (with paragraphs, lists, etc.) into HTML
        const rawHtml = marked.parse(typeof markdown === 'string' ? markdown : String(markdown));
        return DOMPurify.sanitize(rawHtml, {ALLOWED_ATTR: ['href', 'target', 'rel', 'src', 'alt', 'title']});
    } catch (e) {
        console.error('Markdown render error', e);
        return DOMPurify.sanitize(String(markdown));
    }
}

// Utility to extract plain text from HTML (for chatHistory storage)
function extractPlainTextFromHtml(html) {
    const tmp = document.createElement('div');
    tmp.innerHTML = html || '';
    return tmp.textContent || tmp.innerText || '';
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
    const chatDiv = document.getElementById("chatDiv");

    const chunkedTextElem = document.createElement("div");

    chunkedTextElem.className = "botMessage";

    const loadingDiv = document.createElement("div");
    const loadingElem = document.createElement("span");

    loadingDiv.classList.add("loaderContainer");
    loadingElem.classList.add("loader");
    loadingDiv.appendChild(loadingElem);
    chunkedTextElem.appendChild(loadingDiv);

    chatDiv.appendChild(chunkedTextElem);

    const result = await chat.sendMessageStream(
        [
            { 
                inlineData: { 
                    data: await syllabusData, 
                    mimeType: "application/pdf" 
                }
            },
            textPrompt
        ]
    );

    for await (const chunk of result.stream) {
        loadingDiv.style.display = "none";
        createChatStream(chunk.text(), "left", chunkedTextElem);
    }

    endChatStream();

}

function createChatText(text, direction) {
    const chatDiv = document.getElementById("chatDiv");
    const chatText = document.createElement("div");
    
    // Render markdown -> sanitized HTML
    const html = renderMarkdownToHtml(text);

    chatText.innerHTML = html;
    chatText.style.textAlign = direction;
    
    if (direction === "left") {
        chatText.className = "userMessage";
    } else {
        chatText.className = "botMessage";
    }

    chatDiv.append(chatText);

    // Store plaintext in history to avoid embedding HTML in the stored conversation
    chatHistory.push({
        role: direction === "left" ? "user" : "model",
        parts: [{ text: extractPlainTextFromHtml(html) }],
    });
}

function createChatStream(chunk, direction, chunkedTextElem) {

    // chunk is streaming markdown text. We'll render incrementally but always sanitize.
    if (document.getElementById("chunkedText") === null) {
        // First chunk: create an inner container to hold incremental HTML
        const inner = document.createElement('div');
        inner.className = 'chunked-inner';
        inner.style.textAlign = direction;
        inner.innerHTML = renderMarkdownToHtml(chunk);

        chunkedTextElem.appendChild(inner);
        chunkedTextElem.id = "chunkedText";
    } else {
        const chunkedInner = document.querySelector('#chunkedText .chunked-inner');
        if (!chunkedInner) return;

        // Append the new chunk. Use marked.parseInline to avoid breaking surrounding structure when streaming small pieces.
        try {
            const inlineHtml = marked.parseInline(chunk || '');
            chunkedInner.innerHTML += DOMPurify.sanitize(inlineHtml, {ALLOWED_ATTR: ['href', 'target', 'rel', 'src', 'alt', 'title']});
        } catch (e) {
            // Fallback: append as text
            chunkedInner.innerText += chunk;
        }
    }
}

function endChatStream() {
    const chunkedInner = document.querySelector('#chunkedText .chunked-inner');
    if (!chunkedInner) return;

    // Final sanitize and ensure proper HTML
    chunkedInner.innerHTML = DOMPurify.sanitize(chunkedInner.innerHTML, {ALLOWED_ATTR: ['href', 'target', 'rel', 'src', 'alt', 'title']});

    // Remove the id to allow subsequent streams
    const parent = document.getElementById('chunkedText');
    if (parent) parent.id = '';

    chatHistory.push({
        role: "model",
        parts: [{ text: extractPlainTextFromHtml(chunkedInner.innerHTML) }],
    });
}

document.addEventListener("DOMContentLoaded", async () => {
    const messageBox = document.getElementById("messageInput");
    document.scrollingElement.scroll(0, 1);
    messageBox.focus();

    function sendUserPrompt() {
        const messageText = messageBox.value;
        messageBox.value = "";
    
        createChatText(messageText, "left");
    
        runModel(messageText);
    }

    courseInfo = fetchCourseInformation();
    window.courseInfo = courseInfo;

    courseInfo.then((data) => {
        document.getElementById("courseTitle").innerText = `${data.name}`;
        document.getElementById("title").innerText = `${data.name} Syllabot`;
        document.getElementById("messageInput").placeholder = `Ask me anything about ${data.name}...`;
    });

    syllabusData = fetchSyllabus((await courseInfo).syllabus_uri);

    const model = getGenerativeModel(vertexAI, {
        model: "gemini-2.5-flash",
        systemInstruction: `You are SyllabusBot, a chatbot designed to help students answer questions about the ${(await courseInfo).name} syllabus. You have been provided with the syllabus for this course. For each prompt, find the relevant information in the syllabus and provide the answer. The current date is ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric"}) }. Respond in and format responses as markdown, using this format for bold, italics, and lists.`
    });

    window.model = model;

    const chat = model.startChat({
        history: chatHistory,
        generationConfig: {
            maxOutputTokens: 512,
        }
    });

    window.chat = chat;

    // Trigger on user pressing enter
    messageBox.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            sendUserPrompt();
        }
    });

    const suggestionCards = document.getElementsByClassName("suggestionCard");

    for (let i = 0; i < suggestionCards.length; i++) {
        suggestionCards.item(i).addEventListener("click", () => {
            messageBox.value = suggestionCards.item(i).innerText;
            sendUserPrompt();
        });
    }

    // Add the function to the global scope so it can be called via HTML
    window.sendUserPrompt = sendUserPrompt;
});