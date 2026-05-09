// AI Hub - Main JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initScrollHeader();
});

function initNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });
        navMenu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
            });
        });
    }
}

function initScrollHeader() {
    const header = document.getElementById('header');
    if (!header) return;
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 50) {
            header.classList.add('header--scrolled');
        } else {
            header.classList.remove('header--scrolled');
        }
    });
}

function renderPopularTools() {
    const container = document.getElementById('popularTools');
    if (!container) return;
    const popularTools = toolsData.filter(tool => tool.popular).slice(0, 6);
    container.innerHTML = popularTools.map(tool => `
        <div class="tool-card" data-category="${tool.category}" data-price="${tool.price}">
            <div class="tool-card-header">
                <div class="tool-card-icon">${getToolEmoji(tool.category)}</div>
                <div class="tool-card-badges">
                    <span class="badge badge--category">${tool.category}</span>
                    <span class="badge badge--price badge--price--${getPriceClass(tool.price)}">${tool.price}</span>
                </div>
            </div>
            <h3 class="tool-card-title">${tool.name}</h3>
            <p class="tool-card-desc">${tool.shortDesc}</p>
            <div class="tool-card-footer">
                <span class="tool-card-audience">${tool.audience.substring(0, 60)}...</span>
                <div class="tool-card-actions">
                    <a href="tool-detail.html?id=${tool.id}" class="btn btn--small btn--secondary">Подробнее</a>
                    <a href="${tool.website}" target="_blank" class="btn btn--small btn--outline">Сайт →</a>
                </div>
            </div>
        </div>
    `).join('');
}

function renderLatestArticles() {
    const container = document.getElementById('latestArticles');
    if (!container) return;
    const latestArticles = articlesData.slice(0, 4);
    container.innerHTML = latestArticles.map(article => `
        <div class="article-card">
            <div class="article-card-cover" style="background: ${article.coverColor}">
                <span class="article-card-emoji">${article.coverEmoji}</span>
            </div>
            <div class="article-card-body">
                <div class="article-card-meta">
                    <span class="badge badge--category">${article.category}</span>
                    <span class="article-card-date">${article.date}</span>
                </div>
                <h3 class="article-card-title">${article.title}</h3>
                <p class="article-card-desc">${article.subtitle}</p>
                <div class="article-card-footer">
                    <span class="article-card-readtime">⏱ ${article.readTime}</span>
                    <div class="article-card-tags">
                        ${article.tags.slice(0, 2).map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                    <a href="article-detail.html?id=${article.id}" class="btn btn--small btn--secondary">Читать</a>
                </div>
            </div>
        </div>
    `).join('');
}

function renderToolsPage() {
    const container = document.getElementById('toolsGrid');
    if (!container) return;
    renderTools(toolsData);
}

function renderTools(tools) {
    const container = document.getElementById('toolsGrid');
    const noResults = document.getElementById('noResults');
    if (!container) return;
    if (tools.length === 0) {
        container.innerHTML = '';
        if (noResults) noResults.style.display = 'block';
        return;
    }
    if (noResults) noResults.style.display = 'none';
    container.innerHTML = tools.map(tool => `
        <div class="tool-card" data-category="${tool.category}" data-price="${tool.price}">
            <div class="tool-card-header">
                <div class="tool-card-icon">${getToolEmoji(tool.category)}</div>
                <div class="tool-card-badges">
                    <span class="badge badge--category">${tool.category}</span>
                    <span class="badge badge--price badge--price--${getPriceClass(tool.price)}">${tool.price}</span>
                </div>
            </div>
            <h3 class="tool-card-title">${tool.name}</h3>
            <p class="tool-card-desc">${tool.shortDesc}</p>
            <div class="tool-card-footer">
                <span class="tool-card-audience">${tool.audience.substring(0, 60)}...</span>
                <div class="tool-card-actions">
                    <a href="tool-detail.html?id=${tool.id}" class="btn btn--small btn--secondary">Подробнее</a>
                    <a href="${tool.website}" target="_blank" class="btn btn--small btn--outline">Сайт →</a>
                </div>
            </div>
        </div>
    `).join('');
}

function initToolFilters() {
    const searchInput = document.getElementById('toolsSearch');
    const categoryButtons = document.querySelectorAll('#categoryFilters .filter-tag');
    const priceButtons = document.querySelectorAll('#priceFilters .filter-tag');
    const resetBtn = document.getElementById('resetFilters');
    let activeCategory = 'all';
    let activePrice = 'all';
    let searchQuery = '';
    function filterTools() {
        let filtered = toolsData;
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            filtered = filtered.filter(tool => 
                tool.name.toLowerCase().includes(q) ||
                tool.shortDesc.toLowerCase().includes(q) ||
                tool.category.toLowerCase().includes(q)
            );
        }
        if (activeCategory !== 'all') {
            filtered = filtered.filter(tool => tool.category === activeCategory);
        }
        if (activePrice !== 'all') {
            filtered = filtered.filter(tool => tool.price === activePrice);
        }
        renderTools(filtered);
    }
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            searchQuery = this.value.trim();
            filterTools();
        });
    }
    categoryButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            categoryButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            activeCategory = this.dataset.filter;
            filterTools();
        });
    });
    priceButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            priceButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            activePrice = this.dataset.filter;
            filterTools();
        });
    });
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            activeCategory = 'all';
            activePrice = 'all';
            searchQuery = '';
            if (searchInput) searchInput.value = '';
            categoryButtons.forEach(b => b.classList.remove('active'));
            categoryButtons[0].classList.add('active');
            priceButtons.forEach(b => b.classList.remove('active'));
            priceButtons[0].classList.add('active');
            renderTools(toolsData);
        });
    }
}

function renderToolDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const toolId = urlParams.get('id');
    if (!toolId) {
        window.location.href = 'tools.html';
        return;
    }
    const tool = getToolById(toolId);
    if (!tool) {
        window.location.href = 'tools.html';
        return;
    }
    const titleEl = document.getElementById('toolDetailTitle');
    if (titleEl) titleEl.textContent = `${tool.name} — обзор на AI Hub`;
    document.getElementById('toolName').textContent = tool.name;
    document.getElementById('toolShortDesc').textContent = tool.shortDesc;
    document.getElementById('toolCategory').textContent = tool.category;
    document.getElementById('toolPrice').textContent = tool.price;
    document.getElementById('toolAudience').textContent = tool.audience;
    document.getElementById('toolAlternatives').textContent = tool.alternatives;
    document.getElementById('toolRating').textContent = tool.rating;
    document.getElementById('toolRatingText').textContent = tool.ratingText;
    document.getElementById('toolStars').textContent = getStars(tool.rating);
    const linkBtn = document.getElementById('toolLink');
    if (linkBtn) linkBtn.href = tool.website;
    document.getElementById('sidebarCategory').textContent = tool.category;
    document.getElementById('sidebarPrice').textContent = tool.priceLabel || tool.price;
    const sidebarLink = document.getElementById('sidebarLink');
    if (sidebarLink) {
        sidebarLink.href = tool.website;
        sidebarLink.textContent = tool.website.replace('https://', '');
    }
    fillList('toolFeatures', tool.features);
    fillList('toolPros', tool.pros, 'pros');
    fillList('toolCons', tool.cons, 'cons');
    const similarTools = getSimilarTools(tool.category, tool.id, 3);
    const similarContainer = document.getElementById('similarTools');
    if (similarContainer && similarTools.length > 0) {
        similarContainer.innerHTML = similarTools.map(t => `
            <div class="tool-card">
                <div class="tool-card-header">
                    <div class="tool-card-icon">${getToolEmoji(t.category)}</div>
                    <div class="tool-card-badges">
                        <span class="badge badge--category">${t.category}</span>
                        <span class="badge badge--price badge--price--${getPriceClass(t.price)}">${t.price}</span>
                    </div>
                </div>
                <h3 class="tool-card-title">${t.name}</h3>
                <p class="tool-card-desc">${t.shortDesc}</p>
                <div class="tool-card-footer">
                    <div class="tool-card-actions">
                        <a href="tool-detail.html?id=${t.id}" class="btn btn--small btn--secondary">Подробнее</a>
                        <a href="${t.website}" target="_blank" class="btn btn--small btn--outline">Сайт →</a>
                    </div>
                </div>
            </div>
        `).join('');
    }
}

function renderArticlesPage() {
    const container = document.getElementById('articlesGrid');
    if (!container) return;
    renderArticles(articlesData);
}

function renderArticles(articles) {
    const container = document.getElementById('articlesGrid');
    const noResults = document.getElementById('noArticleResults');
    if (!container) return;
    if (articles.length === 0) {
        container.innerHTML = '';
        if (noResults) noResults.style.display = 'block';
        return;
    }
    if (noResults) noResults.style.display = 'none';
    container.innerHTML = articles.map(article => `
        <div class="article-card">
            <div class="article-card-cover" style="background: ${article.coverColor}">
                <span class="article-card-emoji">${article.coverEmoji}</span>
            </div>
            <div class="article-card-body">
                <div class="article-card-meta">
                    <span class="badge badge--category">${article.category}</span>
                    <span class="article-card-date">${article.date}</span>
                </div>
                <h3 class="article-card-title">${article.title}</h3>
                <p class="article-card-desc">${article.subtitle}</p>
                <div class="article-card-footer">
                    <span class="article-card-readtime">⏱ ${article.readTime}</span>
                    <div class="article-card-tags">
                        ${article.tags.slice(0, 3).map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                    <a href="article-detail.html?id=${article.id}" class="btn btn--small btn--secondary">Читать</a>
                </div>
            </div>
        </div>
    `).join('');
}

function initArticleFilters() {
    const searchInput = document.getElementById('articlesSearch');
    const typeButtons = document.querySelectorAll('#articleTypeFilters .filter-tag');
    const resetBtn = document.getElementById('resetArticleFilters');
    let activeType = 'all';
    let searchQuery = '';
    function filterArticles() {
        let filtered = articlesData;
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            filtered = filtered.filter(article => 
                article.title.toLowerCase().includes(q) ||
                article.subtitle.toLowerCase().includes(q) ||
                article.category.toLowerCase().includes(q) ||
                article.tags.some(tag => tag.toLowerCase().includes(q))
            );
        }
        if (activeType !== 'all') {
            filtered = filtered.filter(article => article.category === activeType);
        }
        renderArticles(filtered);
    }
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            searchQuery = this.value.trim();
            filterArticles();
        });
    }
    typeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            typeButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            activeType = this.dataset.filter;
            filterArticles();
        });
    });
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            activeType = 'all';
            searchQuery = '';
            if (searchInput) searchInput.value = '';
            typeButtons.forEach(b => b.classList.remove('active'));
            typeButtons[0].classList.add('active');
            renderArticles(articlesData);
        });
    }
}

function renderArticleDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const articleId = urlParams.get('id');
    if (!articleId) {
        window.location.href = 'articles.html';
        return;
    }
    const article = getArticleById(articleId);
    if (!article) {
        window.location.href = 'articles.html';
        return;
    }
    const titleEl = document.getElementById('articleDetailTitle');
    if (titleEl) titleEl.textContent = `${article.title} — AI Hub`;
    document.getElementById('articleCategory').textContent = article.category;
    document.getElementById('articleDate').textContent = article.date;
    document.getElementById('articleReadTime').textContent = `⏱ ${article.readTime}`;
    document.getElementById('articleTitle').textContent = article.title;
    document.getElementById('articleSubtitle').textContent = article.subtitle;
    const coverEl = document.getElementById('articleCover');
    if (coverEl) {
        coverEl.innerHTML = `<div class="article-cover-inner" style="background: ${article.coverColor}"><span>${article.coverEmoji}</span></div>`;
    }
    const tagsEl = document.getElementById('articleTags');
    if (tagsEl) {
        tagsEl.innerHTML = article.tags.map(tag => `<span class="tag">${tag}</span>`).join('');
    }
    const tldrText = document.querySelector('#articleTldr .tldr-text');
    if (tldrText) tldrText.textContent = article.tldr;
    const tocList = document.getElementById('tocList');
    if (tocList && article.toc) {
        tocList.innerHTML = article.toc.map((item, index) => `
            <li><a href="#toc-${index + 1}">${item}</a></li>
        `).join('');
    }
    const contentEl = document.getElementById('articleContent');
    if (contentEl && article.content) {
        contentEl.innerHTML = article.content;
    }
    const conclusionEl = document.querySelector('#articleConclusion p');
    if (conclusionEl && article.conclusion) {
        conclusionEl.textContent = article.conclusion;
    }
    const relatedToolsGrid = document.getElementById('relatedToolsGrid');
    if (relatedToolsGrid && article.relatedTools) {
        const related = article.relatedTools.map(id => getToolById(id)).filter(Boolean);
        if (related.length > 0) {
            relatedToolsGrid.innerHTML = related.map(tool => `
                <div class="tool-card tool-card--compact">
                    <div class="tool-card-header">
                        <div class="tool-card-icon">${getToolEmoji(tool.category)}</div>
                        <span class="badge badge--category">${tool.category}</span>
                    </div>
                    <h3 class="tool-card-title">${tool.name}</h3>
                    <a href="tool-detail.html?id=${tool.id}" class="btn btn--small btn--secondary">Обзор</a>
                </div>
            `).join('');
        } else {
            document.getElementById('articleRelatedTools').style.display = 'none';
        }
    }
    const similarArticlesGrid = document.getElementById('similarArticlesGrid');
    if (similarArticlesGrid && article.similarArticles) {
        const similar = article.similarArticles.map(id => getArticleById(id)).filter(Boolean);
        if (similar.length > 0) {
            similarArticlesGrid.innerHTML = similar.map(a => `
                <div class="article-card article-card--compact">
                    <div class="article-card-cover" style="background: ${a.coverColor}">
                        <span class="article-card-emoji">${a.coverEmoji}</span>
                    </div>
                    <div class="article-card-body">
                        <span class="badge badge--category">${a.category}</span>
                        <h3 class="article-card-title">${a.title}</h3>
                        <a href="article-detail.html?id=${a.id}" class="btn btn--small btn--secondary">Читать</a>
                    </div>
                </div>
            `).join('');
        } else {
            document.getElementById('articleSimilar').style.display = 'none';
        }
    }
}

function getToolEmoji(category) {
    const emojis = {
        'Текст': '📝',
        'Изображения': '🎨',
        'Видео': '🎬',
        'Презентации': '📊',
        'Маркетинг': '📈',
        'Бизнес': '💼',
        'Автоматизация': '⚙️',
        'Дизайн': '🖌️',
        'Код': '💻',
        'Обучение': '🎓',
        'Аудио': '🎵'
    };
    return emojis[category] || '🤖';
}

function getPriceClass(price) {
    const classes = {
        'Бесплатно': 'free',
        'Freemium': 'freemium',
        'Платно': 'paid'
    };
    return classes[price] || 'freemium';
}

function getStars(rating) {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5 ? 1 : 0;
    const empty = 5 - full - half;
    return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(empty);
}

function fillList(elementId, items, type) {
    const el = document.getElementById(elementId);
    if (!el || !items) return;
    el.innerHTML = items.map(item => `<li>${item}</li>`).join('');
}
  
