// ============================================================
// 语录数据
// ============================================================
const quotes = [
    { text: "生活不止眼前的苟且，还有诗和远方。", author: "高晓松" },
    { text: "什么什么什么", author: "作者" },
    { text: "行动是治愈恐惧的良药。", author: "威廉·詹姆斯" },
    { text: "玩家体验至上！", author: "弘桀孤影行" },
    { text: "建设与发展是方块狂想曲的两大主题。", author: "方块狂想曲" },
    { text: "人生若只如初见，何事秋风悲画扇。", author: "纳兰性德" }
];

// ============================================================
// 语录管理
// ============================================================
var currentQuoteIndex = 0;
var quoteTimer = null;
var QUOTE_INTERVAL = 8000; // 8秒切换一次

function getRandomQuote() {
    var index = Math.floor(Math.random() * quotes.length);
    return quotes[index];
}

function getNextQuote() {
    currentQuoteIndex = (currentQuoteIndex + 1) % quotes.length;
    return quotes[currentQuoteIndex];
}

function formatQuoteHTML(quote) {
    return '<span class="quote-text">“' + quote.text + '”</span>' +
           '<span class="quote-author">—— ' + quote.author + '</span>';
}

function updateQuoteDisplay(element) {
    if (!element) return;
    var quote = getNextQuote();
    element.innerHTML = formatQuoteHTML(quote);
    // 添加动画
    element.classList.remove('quote-fade');
    // 强制回流后添加动画
    void element.offsetWidth;
    element.classList.add('quote-fade');
}

function initQuoteDisplay() {
    var display = document.getElementById('quoteDisplay');
    if (!display) return;

    // 初始显示第一条语录
    var initialQuote = quotes[0] || { text: '欢迎来到方块狂想曲', author: '服务器' };
    display.innerHTML = formatQuoteHTML(initialQuote);
    display.classList.add('quote-fade');

    // 定时切换
    if (quoteTimer) clearInterval(quoteTimer);
    quoteTimer = setInterval(function() {
        updateQuoteDisplay(display);
    }, QUOTE_INTERVAL);
}

// ============================================================
// 页面加载时初始化
// ============================================================
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initQuoteDisplay);
} else {
    initQuoteDisplay();
}
