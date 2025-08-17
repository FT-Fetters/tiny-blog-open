# Tiny Blog User Guide

Welcome to Tiny Blog! This guide will help you quickly get started with blog configuration, content management, and daily usage.

## 📋 Table of Contents

- [Quick Start](#quick-start)
- [Post-Deployment Configuration](#post-deployment-configuration)
- [Content Management](#content-management)
- [Blog Editing & Publishing](#blog-editing--publishing)
- [Advanced Configuration](#advanced-configuration)
- [FAQ](#faq)
- [Troubleshooting](#troubleshooting)

## 🚀 Quick Start

### Initial Configuration After Deployment

1. **Access Your Blog**
   ```
   http://localhost:3131
   ```
   (or the port you specified during deployment)

2. **Check Service Status**
   ```bash
   # Check container status
   docker compose ps
   
   # View logs
   docker compose logs -f
   ```

3. **Verify Data Directory Structure**
   ```
   blog-data/
   ├── content/
   │   ├── posts/          # Your articles will be stored here
   │   ├── pages/          # Static pages like About
   │   └── images/         # Image resources
   └── config/
       └── site.config.json # Site configuration file
   ```

## ⚙️ Post-Deployment Configuration

### 1. Personalize Site Information

Edit the `blog-data/config/site.config.json` file:

```json
{
  "title": "My Blog",
  "description": "This is my personal tech blog",
  "author": {
    "name": "Your Name",
    "email": "your@email.com",
    "github": "github-username",
    "bio": "Brief personal introduction"
  },
  "url": "https://yourdomain.com",
  "social": {
    "github": "https://github.com/username",
    "twitter": "https://twitter.com/username",
    "email": "mailto:contact@example.com"
  },
  "theme": {
    "primaryColor": "#000000",
    "accentColor": "#666666"
  },
  "seo": {
    "keywords": ["tech", "programming", "frontend", "blog"],
    "googleAnalytics": "GA_TRACKING_ID"
  }
}
```

### 2. Configuration Hot Reload

After modifying the configuration, reload it via API:

```bash
curl -X POST http://localhost:3131/api/config/reload \
  -H "Authorization: Bearer YOUR_REVALIDATE_SECRET" \
  -H "Content-Type: application/json"
```

Or restart the container:
```bash
docker compose restart
```

### 3. Customize About Page

Edit `blog-data/content/pages/about-me.md`:

```markdown
---
title: "About Me"
---

# About Me

Here's your personal introduction...

## Skills

- Frontend Development
- Backend Development
- Database Design

## Experience

- 2023-Present: Software Engineer
- 2021-2023: Frontend Developer
```

## 📝 Content Management

### Article Structure

Each article is a Markdown file containing frontmatter and body content:

```markdown
---
title: "Article Title"
date: "2024-01-01"
tags: ["tech", "frontend", "react"]
description: "Article summary for SEO and article list display"
cover: "/images/article-cover.jpg"
published: true
author: "Author Name"
---

# Article Title

This is the main content of the article...

## Section Title

Article content supports all Markdown syntax.

### Code Block Example

```javascript
function hello() {
    console.log("Hello, World!");
}
```

### Image Insertion

![Image Description](/images/example.jpg)
```

### Frontmatter Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | ✅ | Article title |
| `date` | string | ✅ | Publication date (YYYY-MM-DD) |
| `tags` | array | ❌ | Tag array |
| `description` | string | ❌ | Article summary |
| `cover` | string | ❌ | Cover image path |
| `published` | boolean | ❌ | Whether to publish (default true) |
| `author` | string | ❌ | Author name |
| `category` | string | ❌ | Article category |
| `lastModified` | string | ❌ | Last modified time |

### Recommended Directory Structure

```
blog-data/content/posts/
├── 2024-01-01-hello-world.md
├── 2024-01-15-react-best-practices.md
├── 2024-02-01-typescript-guide.md
└── drafts/                    # Draft folder
    └── work-in-progress.md
```

## ✍️ Blog Editing & Publishing

### 1. Create New Article

```bash
# Navigate to posts directory
cd blog-data/content/posts/

# Create new article
touch 2024-08-17-my-new-article.md
```

Edit the article using any text editor:

```bash
# Using vim
vim 2024-08-17-my-new-article.md

# Using VS Code
code 2024-08-17-my-new-article.md

# Using nano
nano 2024-08-17-my-new-article.md
```

### 2. Article Template

Create an article template `blog-data/content/posts/_template.md`:

```markdown
---
title: "Article Title"
date: "2024-08-17"
tags: ["tag1", "tag2"]
description: "Article summary"
cover: "/images/cover.jpg"
published: false
---

# Article Title

## Introduction

Brief introduction to the article content...

## Main Content

### Subsection Title

Specific content...

## Conclusion

Article summary...

---

**References:**
- [Link1](https://example.com)
- [Link2](https://example.com)
```

### 3. Image Management

**Upload Images:**

1. Place images in the `blog-data/content/images/` directory
2. Organize by year/month: `blog-data/content/images/2024/08/`
3. Reference in articles: `![Description](/images/2024/08/image.jpg)`

**Image Optimization Tips:**
- Use WebP format for better compression
- Keep image width under 1200px
- Add meaningful alt text for each image

### 4. Publishing Workflow

1. **Write Article**
   ```markdown
   ---
   published: false  # Draft status
   ---
   ```

2. **Preview and Check**
   - Visit blog homepage to see article list
   - Click article title to preview content
   - Check formatting, images, links, etc.

3. **Publish**
   ```markdown
   ---
   published: true   # Published status
   ---
   ```

4. **Immediate Effect**
   - Changes take effect immediately after saving
   - No need to restart service or rebuild

### 5. Tag Management

**Tag Best Practices:**
- Use consistent tag naming (recommend sticking to English or Chinese)
- 3-5 tags per article is appropriate
- Regularly organize and standardize tags

**View All Tags:**
Visit `http://localhost:3131/tags` to see the tag cloud.

## 🔧 Advanced Configuration

### 1. Custom Domain

If you have your own domain:

1. **Update Configuration File**
   ```json
   {
     "url": "https://yourdomain.com"
   }
   ```

2. **Update Environment Variables**
   ```bash
   # Edit .env file
   SITE_URL=https://yourdomain.com
   ```

3. **Restart Service**
   ```bash
   docker compose restart
   ```

### 2. Data Backup

**Regular backup of important data:**

```bash
# Backup entire data directory
tar -czf blog-backup-$(date +%Y%m%d).tar.gz blog-data/

# Backup content only
tar -czf content-backup-$(date +%Y%m%d).tar.gz blog-data/content/

# Sync to remote server
rsync -av blog-data/ user@server:/backup/blog-data/
```

### 3. Performance Optimization

**Image Optimization:**
```bash
# Batch compress images (requires imagemagick)
cd blog-data/content/images/
find . -name "*.jpg" -exec mogrify -quality 85 {} \;
```

**Content Cleanup:**
```bash
# Clean unused images
# Delete outdated draft files
```

### 4. SEO Optimization

1. **Configure Google Analytics**
   ```json
   {
     "seo": {
       "googleAnalytics": "GA_TRACKING_ID"
     }
   }
   ```

2. **Optimize Article SEO**
   - Use meaningful filenames
   - Fill in accurate descriptions
   - Use appropriate tags
   - Add proper internal links

## ❓ FAQ

### Q1: Article changes don't take effect?

**A1:** 
1. Confirm file is saved
2. Check if Markdown syntax is correct
3. Check browser console for errors
4. Refresh page (Ctrl+F5 for hard refresh)

### Q2: Images not displaying?

**A2:**
1. Check if image path is correct (should start with `/images/`)
2. Confirm image file exists in `blog-data/content/images/` directory
3. Check image file permissions
4. Try different image formats (jpg, png, webp)

### Q3: How to batch import articles?

**A3:**
1. Prepare Markdown files in correct format
2. Place files in `blog-data/content/posts/` directory
3. Ensure each file has correct frontmatter
4. Refresh page to see results

### Q4: How to modify blog theme colors?

**A4:**
1. Edit `blog-data/config/site.config.json`
2. Modify color settings in `theme` section
3. Reload configuration or restart service

### Q5: How to set article password protection?

**A5:**
Current version doesn't support password protection. Alternatives:
1. Set sensitive articles to `published: false`
2. Use external authentication service
3. Upgrade to version with authentication support

## 🔧 Troubleshooting

### Service Won't Start

**Check Steps:**

1. **View Container Status**
   ```bash
   docker compose ps
   docker compose logs blog
   ```

2. **Check Port Usage**
   ```bash
   lsof -i :3131
   netstat -tlnp | grep 3131
   ```

3. **Check Disk Space**
   ```bash
   df -h
   ```

4. **Restart Service**
   ```bash
   docker compose down
   docker compose up -d
   ```

### Empty Article List

**Possible Causes and Solutions:**

1. **Check File Permissions**
   ```bash
   ls -la blog-data/content/posts/
   ```

2. **Check File Format**
   - Ensure file extension is `.md`
   - Check frontmatter format is correct

3. **View API Response**
   ```bash
   curl http://localhost:3131/api/posts
   ```

### Configuration Changes Not Taking Effect

**Solution Steps:**

1. **Check JSON Format**
   ```bash
   # Validate JSON format
   cat blog-data/config/site.config.json | jq .
   ```

2. **Manually Reload Configuration**
   ```bash
   curl -X POST http://localhost:3131/api/config/reload \
     -H "Authorization: Bearer YOUR_SECRET"
   ```

3. **Restart Container**
   ```bash
   docker compose restart
   ```

### Performance Issues

**Optimization Suggestions:**

1. **Check Resource Usage**
   ```bash
   docker stats tiny-blog
   ```

2. **Clean Logs**
   ```bash
   docker compose logs --tail=100 blog
   ```

3. **Optimize Images**
   - Compress image sizes
   - Use appropriate image formats
   - Reduce number of images per page

### Getting Help

If you encounter other issues:

1. **Check Official Documentation**: README.md
2. **Check Log Files**: `docker compose logs`
3. **GitHub Issues**: Create an issue in the project repository
4. **Community Support**: Look for relevant tech communities

---

## 🎉 Congratulations!

You've mastered the basic usage of Tiny Blog. Start creating your first blog post!

Remember:
- 📝 Regularly backup your content
- 🔄 Keep the system updated
- 🎨 Personalize your blog configuration
- 📊 Monitor blog performance and traffic

Enjoy your blogging journey! ✨