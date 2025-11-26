// Page Navigation
function showPage(pageName) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });

    // Show selected page
    document.getElementById(pageName).classList.add('active');

    // Update nav active states
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
    });
    document.querySelector(`[data-page="${pageName}"]`).classList.add('active');

    // Update navbar style
    const navbar = document.getElementById('navbar');
    navbar.classList.add('scrolled');

    // Scroll to top
    window.scrollTo(0, 0);

    // Close mobile menu
    navLinks.classList.remove('active');
}

// Navigation click handlers
document.querySelectorAll('[data-page]').forEach(element => {
    element.addEventListener('click', (e) => {
        e.preventDefault();
        const page = element.getAttribute('data-page');
        showPage(page);
    });
});

// Navbar scroll effect (only on home page)
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (document.getElementById('home').classList.contains('active')) {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
});

// Mobile menu toggle
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Smooth scroll for contact link
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href.startsWith('#') && href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// Form submission is now handled by Formspree

// Google Sheets URLs
const TOUR_SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSs3EqLfeuTLsa3FI5WkWuGZrjaBPTlScRWzrOpVqIS-b3Ab5jES93t9-yTZ7wtvxUpyy_2jTgIlfVP/pub?gid=0&single=true&output=csv';
const MUSIC_SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSs3EqLfeuTLsa3FI5WkWuGZrjaBPTlScRWzrOpVqIS-b3Ab5jES93t9-yTZ7wtvxUpyy_2jTgIlfVP/pub?gid=247786305&single=true&output=csv';

async function loadTourEvents() {
    const tourEventsContainer = document.getElementById('tourEvents');

    try {
        // Use CORS proxy to avoid cross-origin issues
        const CORS_PROXY = 'https://corsproxy.io/?';
        const url = `${CORS_PROXY}${encodeURIComponent(TOUR_SHEET_URL)}`;

        const response = await fetch(url, {
            cache: 'no-cache',
            headers: {
                'Accept': 'text/csv,text/plain,*/*'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const csvText = await response.text();

        // Parse CSV
        const lines = csvText.split('\n');
        const events = [];

        console.log('CSV Data:', csvText);
        console.log('Total lines:', lines.length);

        // Skip header row and parse data
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;

            // Parse CSV line (handle quoted fields)
            const fields = parseCSVLine(line);
            console.log(`Line ${i} fields:`, fields);

            if (fields.length >= 3) {
                const date = fields[0];
                const title = fields[1];
                const description = fields[2];
                const link = fields[3] || '';

                if (date && title) {
                    events.push({ date, title, description, link });
                    console.log('Added event:', { date, title, description, link });
                }
            }
        }

        console.log('Total events parsed:', events.length);

        // Display events or "Coming Soon" message
        if (events.length === 0) {
            tourEventsContainer.innerHTML = `
                <div class="events-coming-soon">
                    <h2>Events Coming Soon</h2>
                    <p>We're currently planning our next performances. Check back soon for updates!</p>
                </div>
            `;
        } else {
            tourEventsContainer.innerHTML = events.map(event => createEventHTML(event)).join('');
        }
    } catch (error) {
        console.error('Error loading tour events:', error);
        tourEventsContainer.innerHTML = `
            <div class="events-coming-soon">
                <h2>Events Coming Soon</h2>
                <p>We're currently planning our next performances. Check back soon for updates!</p>
            </div>
        `;
    }
}

function parseCSVLine(line) {
    const fields = [];
    let field = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        const nextChar = line[i + 1];

        if (char === '"') {
            if (inQuotes && nextChar === '"') {
                field += '"';
                i++; // Skip next quote
            } else {
                inQuotes = !inQuotes;
            }
        } else if (char === ',' && !inQuotes) {
            fields.push(field.trim());
            field = '';
        } else {
            field += char;
        }
    }

    fields.push(field.trim());
    return fields;
}

function createEventHTML(event) {
    const date = new Date(event.date);
    const month = date.toLocaleString('en-US', { month: 'short' }).toUpperCase();
    const day = date.getDate().toString().padStart(2, '0');

    const linkButton = event.link ? `<a href="${event.link}" target="_blank" class="tour-ticket">Info</a>` : '';

    return `
        <div class="tour-event">
            <div class="tour-date">
                <span class="month">${month}</span>
                <span class="day">${day}</span>
            </div>
            <div class="tour-info">
                <h3>${event.title}</h3>
                <p>${event.description}</p>
            </div>
            ${linkButton}
        </div>
    `;
}

// Music Content - Fetch from Google Sheets
async function loadMusicContent() {
    const videosContainer = document.getElementById('videosContent');
    const imagesContainer = document.getElementById('imagesContent');

    try {
        const CORS_PROXY = 'https://corsproxy.io/?';
        const url = `${CORS_PROXY}${encodeURIComponent(MUSIC_SHEET_URL)}`;

        const response = await fetch(url, {
            cache: 'no-cache',
            headers: {
                'Accept': 'text/csv,text/plain,*/*'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const csvText = await response.text();
        const lines = csvText.split('\n');
        const videos = [];
        const images = [];

        console.log('Music CSV Data:', csvText);

        // Skip header row and parse data
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;

            const fields = parseCSVLine(line);
            console.log(`Music Line ${i} fields:`, fields);

            if (fields.length >= 2) {
                const name = fields[0];
                const description = fields[1];
                const imageLink = fields[2] || '';
                const videoLink = fields[3] || '';

                if (name) {
                    if (videoLink) {
                        videos.push({ name, description, videoLink });
                    } else if (imageLink) {
                        images.push({ name, description, imageLink });
                    }
                }
            }
        }

        console.log('Total videos:', videos.length, 'Total images:', images.length);

        // Display videos
        if (videos.length === 0) {
            videosContainer.innerHTML = `
                <div class="music-coming-soon">
                    <h2>No Videos Yet</h2>
                    <p>Check back soon for video content!</p>
                </div>
            `;
        } else {
            videosContainer.innerHTML = videos.map(item => createVideoHTML(item)).join('');
        }

        // Display images
        if (images.length === 0) {
            imagesContainer.innerHTML = `
                <div class="music-coming-soon">
                    <h2>No Images Yet</h2>
                    <p>Check back soon for images!</p>
                </div>
            `;
        } else {
            imagesContainer.innerHTML = `
                <div class="image-grid">
                    ${images.map(item => createImageHTML(item)).join('')}
                </div>
            `;
        }
    } catch (error) {
        console.error('Error loading music content:', error);
        videosContainer.innerHTML = `
            <div class="music-coming-soon">
                <h2>Content Coming Soon</h2>
                <p>We're currently working on new content. Check back soon!</p>
            </div>
        `;
        imagesContainer.innerHTML = '';
    }
}

function createVideoHTML(item) {
    const { name, description, videoLink } = item;
    const youtubeId = extractYouTubeId(videoLink);

    if (youtubeId) {
        // Use clickable thumbnail that opens YouTube (safer than iframe)
        return `
            <div class="music-item video-item">
                <div class="music-item-header">
                    <h3>${name}</h3>
                    <p>${description}</p>
                </div>
                <div class="youtube-preview">
                    <a href="${videoLink}" target="_blank" class="youtube-thumbnail-link">
                        <img src="https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg"
                             alt="${name}"
                             class="youtube-thumbnail"
                             onerror="this.src='https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg'">
                        <div class="play-button">
                            <svg viewBox="0 0 68 48" width="68" height="48">
                                <path d="M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,.13,34,0,34,0S12.21,.13,6.9,1.55 C3.97,2.33,2.27,4.81,1.48,7.74C0.06,13.05,0,24,0,24s0.06,10.95,1.48,16.26c0.78,2.93,2.49,5.41,5.42,6.19 C12.21,47.87,34,48,34,48s21.79-0.13,27.1-1.55c2.93-0.78,4.64-3.26,5.42-6.19C67.94,34.95,68,24,68,24S67.94,13.05,66.52,7.74z" fill="#f00"></path>
                                <path d="M 45,24 27,14 27,34" fill="#fff"></path>
                            </svg>
                        </div>
                    </a>
                    <div class="youtube-link-text">
                        <a href="${videoLink}" target="_blank" class="youtube-link">Watch on YouTube</a>
                    </div>
                </div>
            </div>
        `;
    } else {
        return `
            <div class="music-item video-item">
                <div class="music-item-header">
                    <h3>${name}</h3>
                    <p>${description}</p>
                </div>
                <div class="video-link-container">
                    <a href="${videoLink}" target="_blank" class="youtube-link">Watch on YouTube</a>
                </div>
            </div>
        `;
    }
}

function createImageHTML(item) {
    const { name, description, imageLink } = item;

    return `
        <div class="image-item">
            <div class="image-wrapper">
                <img src="${imageLink}" alt="${name}" loading="lazy">
            </div>
            <div class="image-caption">
                <h4>${name}</h4>
                <p>${description}</p>
            </div>
        </div>
    `;
}

function extractYouTubeId(url) {
    // Handle various YouTube URL formats
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
        /^([a-zA-Z0-9_-]{11})$/ // Direct video ID
    ];

    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match && match[1]) {
            return match[1];
        }
    }

    return null;
}

// Media tabs functionality
function setupMediaTabs() {
    const tabs = document.querySelectorAll('.media-tab');
    const sections = document.querySelectorAll('.media-section');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.dataset.tab;

            // Remove active class from all tabs and sections
            tabs.forEach(t => t.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));

            // Add active class to clicked tab and corresponding section
            tab.classList.add('active');
            document.getElementById(`${targetTab}Content`).classList.add('active');
        });
    });
}

// Load content when page loads
document.addEventListener('DOMContentLoaded', () => {
    loadTourEvents();
    loadMusicContent();
    setupMediaTabs();
});
