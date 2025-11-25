# Marco Baciu & MARCOLLECTIVE

Official website for Marco Baciu, Romanian jazz guitarist, and MARCOLLECTIVE - a Maastricht-based ensemble blending jazz, hip-hop, and Transylvanian folk traditions.

## Project Overview

This is a single-page application showcasing:
- **Home**: Hero section with video background and introduction
- **About**: Detailed biography and ensemble information
- **Band**: Meet the band members with polaroid-style cards
- **Music**: Performance video showcase
- **Tour**: Dynamically loaded upcoming events from Google Sheets

## Features

### Dynamic Tour Events
The tour page automatically loads event data from a published Google Sheets spreadsheet, allowing easy event management without code changes.

**Google Sheets Structure:**
- Column A: DATE (format: MM/DD/YYYY)
- Column B: TITLE (event name)
- Column C: DESCRIPTION (venue, location, details)
- Column D: LINK (optional - event URL/ticket link)

**Spreadsheet URL:**
```
https://docs.google.com/spreadsheets/d/e/2PACX-1vSs3EqLfeuTLsa3FI5WkWuGZrjaBPTlScRWzrOpVqIS-b3Ab5jES93t9-yTZ7wtvxUpyy_2jTgIlfVP/pub?output=csv
```

### How to Update Tour Events

1. Open the Google Sheet
2. Add a new row with:
   - Date (e.g., 12/15/2025)
   - Event title
   - Description/venue
   - Link (optional - leave empty if no link)
3. Save the changes
4. The website will automatically show the new event on next page load

**Notes:**
- Events without links won't display an "Info" button
- If the spreadsheet is empty, displays "Events Coming Soon" message
- Events are displayed with formatted dates (month abbreviation + day)

## File Structure

```
marcobaciu/
├── index.html          # Main HTML structure
├── styles.css          # All styling and responsive design
├── script.js           # Navigation, form handling, and tour events
├── video.MP4           # Hero section background video
├── performance.MP4     # Music page performance video
├── marco.JPG           # Marco Baciu photos
├── pianist.JPG         # Dan Smit photo
├── drums.JPG           # Giuseppe Gallitelli photo
├── bass.JPG            # Valerio Ruperto photo
└── README.md           # This file
```

## Technical Details

### Technologies Used
- HTML5
- CSS3 (Grid, Flexbox, Custom Properties)
- Vanilla JavaScript (ES6+)
- Google Fonts (Cormorant Garamond, Inter, Caveat)

### Google Sheets Integration
- Uses CORS proxy (allorigins.win) to fetch CSV data
- Parses CSV with support for quoted fields
- Cache-busting to ensure fresh data on each load
- Graceful error handling with fallback message

### Responsive Design
- Mobile-first approach
- Hamburger menu for mobile navigation
- Optimized images and videos
- Fluid typography using clamp()

## Local Development

To run locally, use a local development server (not file:// protocol):

**Option 1: Python**
```bash
python -m http.server 8000
```

**Option 2: Node.js**
```bash
npx http-server
```

**Option 3: VS Code**
Install "Live Server" extension and click "Go Live"

Then open `http://localhost:8000` (or appropriate port) in your browser.

## Contact Information

- **Email**: marcobaciu@gmail.com
- **Phone**: +40 749 420 469
- **Instagram**: [@marco_baciu_](https://instagram.com/marco_baciu_)

## License

© 2024 Marco Baciu & MARCOLLECTIVE. All rights reserved.
