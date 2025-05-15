document.getElementById('extractButton').addEventListener('click', () => {
    const inputText = document.getElementById('inputText').value;
    const outputDiv = document.getElementById('output');
    outputDiv.innerHTML = ""; // Clear previous output

    // Regex to match comments (captures usernames, time, and comment text)
    const commentRegex = /@([\w-]+)\s*(\d+[^\n]*)\n([^\n]+)/g;

    let match;
    const comments = [];
    while ((match = commentRegex.exec(inputText)) !== null) {
        const username = match[1];
        const time = match[2];
        const comment = match[3];

        comments.push({ username, time, comment });
    }

    // Categorizing comments
    const categories = {
        questions: [],
        timestamps: [],
        positive: [],
        negative: [],
        praise: [],
        funny: [],
        sad: [],
        angry: [],
        differentLanguage: [],
        emoji: [],
        general: []
    };

    const positiveWords = ['great', 'good', 'awesome', 'love', 'like', 'beautiful'];
    const negativeWords = ['bad', 'ugly', 'hate', 'worst', 'awful'];
    const praiseEmojis = ['👏', '❤️', '👍'];
    const funnyEmojis = ['😂', '🤣', '😅'];
    const sadEmojis = ['😢', '😔', '💔'];
    const angryEmojis = ['👎', '😡', '😠'];

    comments.forEach(item => {
        const { comment } = item;

        if (/\?\s*$/.test(comment)) {
            categories.questions.push(item);
        } else if (/\d{1,2}:\d{2}/.test(comment)) {
            categories.timestamps.push(item);
        } else if (positiveWords.some(word => new RegExp(`\\b${word}\\b`, 'i').test(comment))) {
            categories.positive.push(item);
        } else if (negativeWords.some(word => new RegExp(`\\b${word}\\b`, 'i').test(comment))) {
            categories.negative.push(item);
        } else if (praiseEmojis.some(emoji => comment.includes(emoji))) {
            categories.praise.push(item);
        } else if (funnyEmojis.some(emoji => comment.includes(emoji))) {
            categories.funny.push(item);
        } else if (sadEmojis.some(emoji => comment.includes(emoji)) || /(?:sad|cry|hurt|suffer|pain)/i.test(comment)) {
            categories.sad.push(item);
        } else if (angryEmojis.some(emoji => comment.includes(emoji)) || /(?:angry|hate|rage|mad|upset)/i.test(comment)) {
            categories.angry.push(item);
        } else {
            categories.general.push(item);
        }
    });

    // Display total count
    const totalComments = comments.length;
    outputDiv.innerHTML += `<div>Total Comments: ${totalComments}</div><br>`;

    // Display categories with counts
    for (let category in categories) {
        if (categories[category].length > 0) {
            outputDiv.innerHTML += `<div class="category-title">${category.charAt(0).toUpperCase() + category.slice(1)} (${categories[category].length})</div>`;
            categories[category].forEach(item => {
                outputDiv.innerHTML += `<div><strong>@${item.username}</strong> ${item.time}<br>${item.comment}</div><br>`;
            });
        }
    }
});

// Handle Info Popup
document.getElementById('infoButton').addEventListener('click', () => {
    document.getElementById('infoPopup').style.display = 'block';
});

document.getElementById('closePopup').addEventListener('click', () => {
    document.getElementById('infoPopup').style.display = 'none';
});
