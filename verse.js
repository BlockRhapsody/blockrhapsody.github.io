// ============================================================
// 语录数据
// ============================================================
const quotes = [
    { text: "生活不止眼前的苟且，还有诗和远方。", author: "高晓松" },
    { text: "人生若只如初见，何事秋风悲画扇。", author: "纳兰性德" },
    { text: "行动是治愈恐惧的良药。", author: "威廉·詹姆斯" },
    { text: "被酒莫惊春睡重，赌书消得泼茶香。当时只道是寻常。", author: "纳兰性德" },
    { text: "待到秋来九月八，我花开后百花杀。", author: "黄巢" },
    { text: "沉舟侧畔千帆过，病树前头万木春。", author: "刘禹锡" },
    { text: "人生自古谁无死，留取丹心照汗青。", author: "文天祥" },
    { text: "旧时王谢堂前燕，飞入寻常百姓家。", author: "刘禹锡" },
    { text: "欲为圣明除弊事，肯将衰朽惜残年。", author: "韩愈" },
    { text: "而今识尽愁滋味，欲说还休。欲说还休，却道天凉好个秋！", author: "辛弃疾" },
    { text: "可上九天揽月，可下五洋捉鳖，谈笑凯歌还。", author: "毛泽东" },
    { text: "等闲变却故人心，却道故人心易变。", author: "纳兰性德" },
    { text: "从此无心爱良夜，任他明月下西楼。", author: "李益" },
    { text: "世间无限丹青手，一片伤心画不成。", author: "高蟾" },
    { text: "今人不见古时月，今月曾经照古人。", author: "李白" },
    { text: "当时年少春衫薄，骑马倚斜桥，满楼红袖招。", author: "韦庄" },
    { text: "万里悲秋常作客，百年多病独登台。", author: "杜甫" },
    { text: "每个人都有自己注定的那一天。", author: "维吉尔" }
];

// ============================================================
// 语录管理
// ============================================================
var currentQuoteIndex = 0;
var quoteTimer = null;
var QUOTE_INTERVAL = 8000; // 8秒切换一次

// 渐变色配置（可自行调整颜色）
var GRADIENT_COLORS = [
    'linear-gradient(90deg, #ff6b6b, #feca57, #48dbfb, #ff9ff3)',
    'linear-gradient(90deg, #f093fb, #f5576c, #4facfe)',
    'linear-gradient(90deg, #43e97b, #38f9d7)',
    'linear-gradient(90deg, #fa709a, #fee140)',
    'linear-gradient(90deg, #a18cd1, #fbc2eb)',
    'linear-gradient(90deg, #fccb90, #d57eeb)',
    'linear-gradient(90deg, #89f7fe, #66a6ff)',
    'linear-gradient(90deg, #f6d365, #fda085)'
];

function getRandomGradient() {
    return GRADIENT_COLORS[Math.floor(Math.random() * GRADIENT_COLORS.length)];
}

function getRandomQuote() {
    var index = Math.floor(Math.random() * quotes.length);
    return quotes[index];
}

function getNextQuote() {
    currentQuoteIndex = (currentQuoteIndex + 1) % quotes.length;
    return quotes[currentQuoteIndex];
}

function formatQuoteHTML(quote) {
    var gradient = getRandomGradient();
    // 作者姓名作为链接，点击跳转到百度搜索
    var authorLink = 'https://www.baidu.com/s?wd=' + encodeURIComponent(quote.author);
    return '<span class="quote-text" style="background:' + gradient + ';-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">“' + quote.text + '”</span>' +
           ' <a href="' + authorLink + '" target="_blank" class="quote-author" style="color:#ffffff;-webkit-text-fill-color:#ffffff;">—— ' + quote.author + '</a>';
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
