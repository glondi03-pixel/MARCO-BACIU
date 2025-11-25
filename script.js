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

// Form submission
document.querySelector('.contact-form').addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Thank you for your message! We will get back to you soon.');
    e.target.reset();
});

// Tour Events - Fetch from Google Sheets
const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSs3EqLfeuTLsa3FI5WkWuGZrjaBPTlScRWzrOpVqIS-b3Ab5jES93t9-yTZ7wtvxUpyy_2jTgIlfVP/pub?output=csv';

async function loadTourEvents() {
    const tourEventsContainer = document.getElementById('tourEvents');

    try {
        // Use CORS proxy to avoid cross-origin issues
        const CORS_PROXY = 'https://corsproxy.io/?';
        const url = `${CORS_PROXY}${encodeURIComponent(SHEET_CSV_URL)}`;

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

// Load tour events when page loads
document.addEventListener('DOMContentLoaded', loadTourEvents);
