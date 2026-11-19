// مفتاح OpenRouter API المضاف بناءً على طلبك
const API_KEY = "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";

const chatBox = document.getElementById('chat-box');
const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const clearBtn = document.getElementById('clear-chat');
const promptChips = document.querySelectorAll('.prompt-chip');

// إضافة رسالة إلى صندوق المحادثة
function appendMessage(text, isUser = false) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message');
    msgDiv.classList.add(isUser ? 'user-message' : 'bot-message');
    msgDiv.textContent = text;
    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
    return msgDiv;
}

// الاتصال بـ OpenRouter API للحصول على رد حقيقي
async function fetchAIResponse(promptText) {
    const loadingMsg = appendMessage('جاري تحليل الطلب وإعداد الرد...', false);
    sendBtn.disabled = true;

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${API_KEY}`,
                "Content-Type": "application/json",
                "HTTP-Referer": window.location.origin, // مطلوب من OpenRouter
                "X-Title": "AI Life Project by Youssef Hossam" // اسم المشروع
            },
            body: JSON.stringify({
                model: "deepseek/deepseek-chat", // نموذج سريع وعالي الكفاءة
                messages: [
                    {
                        role: "system",
                        content: "أنت مستشار تقني محترف وجاد في منصة يشرف عليها المطور يوسف حسام. مهمتك شرح وتطبيق حلول الذكاء الاصطناعي في الحياة اليومية والعملية بأسلوب واضح، عملي، ومباشر باللغة العربية الفصحى."
                    },
                    {
                        role: "user",
                        content: promptText
                    }
                ]
            })
        });

        if (!response.ok) {
            throw new Error('حدث خطأ في الاتصال بالخادم. يرجى التحقق من المفتاح أو الاتصال.');
        }

        const data = await response.json();
        const reply = data.choices?.[0]?.message?.content || 'عذراً، لم أتمكن من معالجة الطلب حالياً.';
        loadingMsg.textContent = reply;
    } catch (error) {
        loadingMsg.textContent = 'تنبيه: حدث خطأ أثناء الاتصال بالـ API. تأكد من صحة الاتصال بالإنترنت.';
        console.error("OpenRouter Error:", error);
    } finally {
        sendBtn.disabled = false;
        chatBox.scrollTop = chatBox.scrollHeight;
    }
}

// إرسال النموذج عند الكتابة والضغط على إرسال
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = userInput.value.trim();
    if (!text) return;

    appendMessage(text, true);
    userInput.value = '';
    fetchAIResponse(text);
});

// التعامل مع الأزرار السريعة للاستعلام الجاهز
promptChips.forEach(chip => {
    chip.addEventListener('click', () => {
        const prompt = chip.getAttribute('data-prompt');
        appendMessage(prompt, true);
        fetchAIResponse(prompt);
    });
});

// زر مسح المحادثة
clearBtn.addEventListener('click', () => {
    chatBox.innerHTML = '<div class="message bot-message">تم مسح المحادثة. كيف يمكنني مساعدتك اليوم؟</div>';
});

// زر نسخ البريد الإلكتروني الخاص بيوسف حسام
const copyEmailBtn = document.getElementById('copy-email');
if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', () => {
        navigator.clipboard.writeText('y3268232@gmail.com');
        copyEmailBtn.textContent = 'تم النسخ';
        setTimeout(() => {
            copyEmailBtn.textContent = 'نسخ';
        }, 2000);
    });
}

// نموذج التواصل لإرسال البريد المباشر
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('sender-name').value;
        const subject = document.getElementById('email-subject').value;
        const body = document.getElementById('email-body').value;
        
        const mailtoLink = `mailto:y3268232@gmail.com?subject=${encodeURIComponent(subject + ' - من: ' + name)}&body=${encodeURIComponent(body)}`;
        window.location.href = mailtoLink;
    });
}