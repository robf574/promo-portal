# GitHub Pages Configuration

This repository is set up for GitHub Pages hosting.

## Setup Instructions

1. Push this repository to GitHub
2. Go to repository Settings
3. Scroll down to "Pages" section
4. Under "Source", select "Deploy from a branch"
5. Choose "main" branch and "/ (root)" folder
6. Click "Save"
7. Your site will be available at: `https://[username].github.io/promo-portal`

## Custom Domain (Optional)

If you have a custom domain:
1. Add a `CNAME` file with your domain name
2. Configure DNS settings as instructed by GitHub
3. Enable "Enforce HTTPS" in Pages settings

## File Structure

```
promo-portal/
├── index.html          # Main page
├── style.css          # Styles
├── script.js          # JavaScript
├── README.md          # Documentation
└── .git/              # Git repository
```

The site will automatically deploy when you push changes to the main branch.
