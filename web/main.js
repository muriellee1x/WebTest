// 博客数据
const blogs = [
    {
        id: 1,
        title: "设计师需要学习 AI Coding 吗？",
        audioUrl: "./audio/v1.MP3",
        coverImage: "./images/cover1.jpg"
    },
    {
        id: 2,
        title: "AI 会替代设计师吗？",
        audioUrl: "./audio/blog2.mp3",
        coverImage: "./images/cover2.jpg"
    },
    {
        id: 3,
        title: "AI 搜索能否替代传统搜索？",
        audioUrl: "./audio/blog3.mp3",
        coverImage: "./images/cover3.jpg"
    },
    {
        id: 4,
        title: "高领设计师的出路",
        audioUrl: "./audio/blog4.mp3",
        coverImage: "./images/cover4.jpg"
    }
];

// 全局变量
let currentAudio = null;
let isPlaying = false;
let isDragging = false;

// 播放博客函数
function playBlog(blog) {
    const playerContainer = document.getElementById('playerContainer');
    const playIcon = document.getElementById('playIcon');
    const nowPlaying = document.getElementById('nowPlaying');
    const progressBar = document.getElementById('progressBar');
    const timeInfo = document.getElementById('timeInfo');

    if (currentAudio) {
        currentAudio.pause();
        currentAudio = null;
        isPlaying = false;
    }

    currentAudio = new Audio(blog.audioUrl);
    nowPlaying.textContent = `正在播放: ${blog.title}`;
    playerContainer.classList.add('active');

    currentAudio.addEventListener('loadedmetadata', () => {
        timeInfo.textContent = `0:00 / ${formatTime(currentAudio.duration)}`;
    });

    currentAudio.addEventListener('timeupdate', () => {
        if (!isDragging) {
            const progress = (currentAudio.currentTime / currentAudio.duration) * 100;
            progressBar.style.width = `${progress}%`;
            timeInfo.textContent = `${formatTime(currentAudio.currentTime)} / ${formatTime(currentAudio.duration)}`;
        }
    });

    currentAudio.play().then(() => {
        isPlaying = true;
        playIcon.className = 'fas fa-pause';
    }).catch(error => {
        console.error('播放失败:', error);
        isPlaying = false;
        playIcon.className = 'fas fa-play';
    });
}

// 切换播放/暂停
function togglePlay() {
    if (!currentAudio) return;

    const playIcon = document.getElementById('playIcon');
    
    if (isPlaying) {
        currentAudio.pause();
        playIcon.className = 'fas fa-play';
        isPlaying = false;
    } else {
        currentAudio.play().then(() => {
            playIcon.className = 'fas fa-pause';
            isPlaying = true;
        }).catch(error => console.error('播放失败:', error));
    }
}

// 格式化时间
function formatTime(seconds) {
    if (!seconds || isNaN(seconds)) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// 创建博客卡片
function createBlogCards() {
    const blogList = document.getElementById('blogList');
    if (!blogList) return;

    blogList.innerHTML = '';

    blogs.forEach(blog => {
        const card = document.createElement('div');
        card.className = 'blog-card';
        card.innerHTML = `
            <img src="${blog.coverImage}" alt="" class="blog-cover">
            <div class="blog-content">
                <div class="blog-title">${blog.title}</div>
            </div>
        `;
        card.addEventListener('click', () => playBlog(blog));
        blogList.appendChild(card);
    });
}

// 初始化函数
function init() {
    createBlogCards();
    initStars();
    initCardEffects();
    initProgressBar();
}

// 星星效果
function createStar() {
    const star = document.createElement('div');
    star.className = 'star';
    
    star.style.left = Math.random() * 100 + '%';
    star.style.top = Math.random() * 100 + '%';
    
    const size = Math.random() * 2 + 1;
    star.style.width = size + 'px';
    star.style.height = size + 'px';
    
    const duration = Math.random() * 4 + 3;
    star.style.animation = `twinkle ${duration}s infinite`;
    
    return star;
}

function initStars() {
    const starsContainer = document.getElementById('stars');
    for (let i = 0; i < 100; i++) {
        starsContainer.appendChild(createStar());
    }
}

// 卡片效果
function initCardEffects() {
    const cards = document.querySelectorAll('.blog-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', handleMouseMove);
        card.addEventListener('mouseleave', handleMouseLeave);
        card.addEventListener('mousedown', handleMouseDown);
        card.addEventListener('mouseup', handleMouseUp);
    });
}

function handleMouseMove(e) {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = (e.clientX - centerX) / (rect.width / 2);
    const deltaY = (e.clientY - centerY) / (rect.height / 2);
    
    const rotateY = deltaX * 15;
    const rotateX = -deltaY * 15;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
}

function handleMouseLeave(e) {
    const card = e.currentTarget;
    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
}

function handleMouseDown(e) {
    const card = e.currentTarget;
    card.style.transform += ' scale(0.98)';
}

function handleMouseUp(e) {
    const card = e.currentTarget;
    card.style.transform = card.style.transform.replace(' scale(0.98)', '');
}

// 进度条功能
function initProgressBar() {
    const progressContainer = document.getElementById('progressContainer');
    const progressBar = document.getElementById('progressBar');
    const timeInfo = document.getElementById('timeInfo');

    progressContainer.addEventListener('click', handleProgressClick);
    progressContainer.addEventListener('mousedown', handleProgressDragStart);
    document.addEventListener('mousemove', handleProgressDrag);
    document.addEventListener('mouseup', handleProgressDragEnd);
}

function handleProgressClick(e) {
    if (!currentAudio) return;
    updateProgress(e);
}

function handleProgressDragStart(e) {
    if (!currentAudio) return;
    isDragging = true;
    updateProgress(e);
}

function handleProgressDrag(e) {
    if (isDragging) {
        updateProgress(e);
    }
}

function handleProgressDragEnd() {
    isDragging = false;
}

function updateProgress(e) {
    if (!currentAudio) return;
    
    const progressContainer = document.getElementById('progressContainer');
    const progressBar = document.getElementById('progressBar');
    const timeInfo = document.getElementById('timeInfo');
    
    const rect = progressContainer.getBoundingClientRect();
    let pos = (e.clientX - rect.left) / rect.width;
    pos = Math.max(0, Math.min(1, pos));
    
    progressBar.style.width = `${pos * 100}%`;
    currentAudio.currentTime = pos * currentAudio.duration;
    timeInfo.textContent = `${formatTime(currentAudio.currentTime)} / ${formatTime(currentAudio.duration)}`;
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', init); 