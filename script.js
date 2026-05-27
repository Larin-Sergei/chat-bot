const input = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const chatMessages = document.getElementById('chatMessages');

let currentName = '';
let numbers = [];
let isStarted = false;

let typingIndicator = null;

input.addEventListener('input', () => {

    const hasText = input.value.trim() !== '';

    sendButton.disabled = !hasText;

    if (hasText) {
        showUserTyping();
    } else {
        removeUserTyping();
    }
});

sendButton.addEventListener('click', sendMessage);

input.addEventListener('keypress', (e) => {

    if (e.key === 'Enter' && input.value.trim() !== '') {
        sendMessage();
    }
});

function sendMessage() {

    const text = input.value.trim();

    if (!text) return;

    removeUserTyping();

    addMessage(text, 'user');

    input.value = '';

    sendButton.disabled = true;

    showBotTyping();

    setTimeout(() => {

        removeBotTyping();

        botLogic(text);

    }, 1200);
}

function addMessage(text, sender) {

    const row = document.createElement('div');

    row.classList.add('message-row');

    if (sender === 'user') {
        row.classList.add('user');
    }

    const avatar = document.createElement('img');

    avatar.classList.add('avatar');

    avatar.src =
        sender === 'user'
            ? 'assets/user_avatar.png'
            : 'assets/bot_avatar.png';

    const message = document.createElement('div');

    message.classList.add('message');

    if (sender === 'user') {
        message.classList.add('user-message');
    } else {
        message.classList.add('bot-message');
    }

    message.textContent = text;

    row.appendChild(avatar);
    row.appendChild(message);

    chatMessages.appendChild(row);

    scrollToBottom();
}

function showUserTyping() {

    if (typingIndicator) return;

    typingIndicator = document.createElement('div');

    typingIndicator.classList.add('message-row');
    typingIndicator.classList.add('user');

    typingIndicator.id = 'userTyping';

    const avatar = document.createElement('img');

    avatar.classList.add('avatar');
    avatar.src = 'assets/user_avatar.png';

    const typing = document.createElement('div');

    typing.classList.add('message');
    typing.classList.add('user-message');
    typing.classList.add('typing');

    typing.innerHTML = `
        <span></span>
        <span></span>
        <span></span>
    `;

    typingIndicator.appendChild(avatar);
    typingIndicator.appendChild(typing);

    chatMessages.appendChild(typingIndicator);

    scrollToBottom();
}

function removeUserTyping() {

    if (typingIndicator) {

        typingIndicator.remove();

        typingIndicator = null;
    }
}

function showBotTyping() {

    const row = document.createElement('div');

    row.classList.add('message-row');

    row.id = 'botTyping';

    const avatar = document.createElement('img');

    avatar.classList.add('avatar');
    avatar.src = 'assets/bot_avatar.png';

    const typing = document.createElement('div');

    typing.classList.add('message');
    typing.classList.add('bot-message');
    typing.classList.add('typing');

    typing.innerHTML = `
        <span></span>
        <span></span>
        <span></span>
    `;

    row.appendChild(avatar);
    row.appendChild(typing);

    chatMessages.appendChild(row);

    scrollToBottom();
}

function removeBotTyping() {

    const botTyping = document.getElementById('botTyping');

    if (botTyping) {
        botTyping.remove();
    }
}

function botLogic(text) {

    if (text === '/start') {

        isStarted = true;

        addMessage(
            'Привет, меня зовут Чат-бот, а как зовут тебя?',
            'bot'
        );

        return;
    }

    if (!isStarted) {

        addMessage(
            'Введите команду /start, для начала общения',
            'bot'
        );

        return;
    }

    if (text === '/stop') {

        isStarted = false;

        currentName = '';
        numbers = [];

        addMessage(
            'Всего доброго, если хочешь поговорить пиши /start',
            'bot'
        );

        return;
    }

    if (text.startsWith('/name:')) {

        currentName = text.split(':')[1]?.trim();

        if (!currentName) {

            addMessage(
                'Введите имя после команды /name:',
                'bot'
            );

            return;
        }

        addMessage(
            `Привет ${currentName}, приятно познакомиться. Я умею считать, введи числа которые надо посчитать`,
            'bot'
        );

        return;
    }

    if (text.startsWith('/number:')) {

        const nums = text
            .split(':')[1]
            ?.split(',')
            .map(num => Number(num.trim()));

        if (
            !nums ||
            nums.length !== 2 ||
            nums.some(isNaN)
        ) {

            addMessage(
                'Введите два числа через запятую',
                'bot'
            );

            return;
        }

        numbers = nums;

        addMessage(
            'Введите действие: +  -  *  /',
            'bot'
        );

        return;
    }

    if (['+', '-', '*', '/'].includes(text)) {

        if (numbers.length !== 2) {

            addMessage(
                'Сначала введите числа через /number:',
                'bot'
            );

            return;
        }

        let result;

        switch (text) {

            case '+':
                result = numbers[0] + numbers[1];
                break;

            case '-':
                result = numbers[0] - numbers[1];
                break;

            case '*':
                result = numbers[0] * numbers[1];
                break;

            case '/':

                if (numbers[1] === 0) {

                    addMessage(
                        'На ноль делить нельзя',
                        'bot'
                    );

                    return;
                }

                result = numbers[0] / numbers[1];
                break;
        }

        addMessage(
            `Результат: ${result}`,
            'bot'
        );

        return;
    }

    addMessage(
        'Я не понимаю, введите другую команду!',
        'bot'
    );
}

function scrollToBottom() {

    chatMessages.scrollTop =
        chatMessages.scrollHeight;
}
