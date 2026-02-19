const canvas = document.getElementById("hero-canvas");
const context = canvas.getContext("2d");

// Configuration
const frameCount = 240;
const currentFrame = index => (
  `./frames/ezgif-frame-${index.toString().padStart(3, '0')}.jpg`
);

// Preloading images
const images = [];
for (let i = 1; i <= frameCount; i++) {
  const img = new Image();
  img.src = currentFrame(i);
  images.push(img);
}

// Draw logic
const img = new Image();
img.src = currentFrame(1);
canvas.width = 1920; // Match your image aspect ratio
canvas.height = 1080;

img.onload = function() {
  context.drawImage(img, 0, 0);
};

const updateImage = index => {
  context.drawImage(images[index], 0, 0);
};

window.addEventListener('scroll', () => {  
  const scrollTop = document.documentElement.scrollTop;
  const maxScrollTop = document.documentElement.scrollHeight - window.innerHeight;
  const scrollFraction = scrollTop / maxScrollTop;
  const frameIndex = Math.min(
    frameCount - 1,
    Math.floor(scrollFraction * frameCount)
  );
  
  requestAnimationFrame(() => updateImage(frameIndex));
});

// --- CHATBOT LOGIC ---
const chatToggle = document.getElementById('chat-toggle');
const chatWindow = document.getElementById('chat-window');
const sendBtn = document.getElementById('send-btn');
const userInput = document.getElementById('user-input');
const messages = document.getElementById('chat-messages');

chatToggle.onclick = () => {
    chatWindow.style.display = chatWindow.style.display === 'flex' ? 'none' : 'flex';
};

async function handleChat() {
    const text = userInput.value;
    if (!text) return;

    messages.innerHTML += `<div><b>You:</b> ${text}</div>`;
    userInput.value = '';

    // STRICT SYSTEM PROMPT
    const system_instruction = "You are a Resume Bot for Kiruthika. Information: ECE student at GCE Tirunelveli, CGPA 8.23. Skills: PLC, Automation, C, Python. Projects: Industrial Automation using PLC, Garbage Segregation, Water Level Indicator. Only answer using this info. If asked anything else, say 'I only have info regarding Kiruthika's professional resume.'";

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=YOUR_API_KEY_HERE`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: `${system_instruction}\n\nUser Question: ${text}` }] }]
            })
        });
        const data = await response.json();
        const botReply = data.candidates[0].content.parts[0].text;
        messages.innerHTML += `<div><b>Bot:</b> ${botReply}</div>`;
    } catch (e) {
        messages.innerHTML += `<div><b>Bot:</b> Unable to connect.</div>`;
    }
}

sendBtn.onclick = handleChat;
