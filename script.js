document.addEventListener('DOMContentLoaded', () => {
    console.log('AmitToo - Webcomic Hub Loaded!');

    
    const comicsData = [
        {
            id: 1,
            title: 'The Last Sorcerer',
            author: 'Jane Doe',
            genres: ['Fantasy', 'Action'],
            imageUrl: "images/f2.jpg",
            description: 'In a world where magic has faded, a young sorcerer emerges, destined to bring balance or utter destruction. A thrilling tale of power, betrayal, and destiny.',
            episodes: [
                { id: 1, title: 'The Awakening' },
                { id: 2, title: 'Echoes of the Past' },
                { id: 3, title: 'The Oracle\'s Prophecy' },
            ]
        },
        {
            id: 2,
            title: 'Love in the Stars',
            author: 'John Smith',
            genres: ['Romance', 'Sci-Fi'],
            imageUrl: "images/f4.jpeg",

            description: 'Two souls from different galaxies find each other amidst an interstellar war. Can their love transcend the cosmos and unite their fractured worlds?',
            episodes: [
                { id: 1, title: 'First Contact' },
                { id: 2, title: 'Across the Void' },
            ]
        },
        {
            id: 3,
            title: 'Haunted Mansion Mystery',
            author: 'Emily White',
            genres: ['Horror', 'Mystery'],
            imageUrl: "images/f5.jpeg",
            description: 'A group of friends dares to spend a night in the infamous Blackwood Manor, only to uncover its dark secrets and face chilling paranormal encounters.',
            episodes: [
                { id: 1, title: 'The Dare' },
                { id: 2, title: 'Whispers in the Dark' },
                { id: 3, title: 'The Forgotten Room' },
                { id: 4, title: 'The True Horrors' },
            ]
        },
        {
            id: 4,
            title: 'Urban Chronicles',
            author: 'Alex Lee',
            genres: ['Slice of Life', 'Comedy'],
            imageUrl: "images/f6.jpeg",
            description: 'Follow the hilarious and heartwarming everyday adventures of a quirky group of friends navigating the bustling city life. Full of relatable moments and laughter.',
            episodes: [
                { id: 1, title: 'Coffee Shop Chaos' },
                { id: 2, title: 'Lost in Translation' },
            ]
        }
    ];

    const comicGrid = document.getElementById('comic-grid');
    const genreTagsContainer = document.querySelector('.genre-tags');
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');

    
    const homepageSection = document.getElementById('homepage-section');
    const comicDetailPage = document.getElementById('comic-detail-page');
    const backToHomeFromDetailBtn = document.getElementById('back-to-home-from-detail');

    
    const detailComicTitle = document.getElementById('detail-comic-title');
    const detailComicAuthor = document.getElementById('detail-comic-author');
    const detailComicDescription = document.getElementById('detail-comic-description');
    const detailEpisodeList = document.getElementById('detail-episode-list');


    
    function showHomepage() {
        homepageSection.classList.remove('hidden');
        comicDetailPage.classList.add('hidden');
        
        searchInput.value = '';
        genreTagsContainer.querySelector('.genre-tag.active').classList.remove('active');
        genreTagsContainer.querySelector('[data-genre="all"]').classList.add('active');
        filterComics('all', ''); 
    }

    function showComicDetailPage(comicId) {
        homepageSection.classList.add('hidden');
        comicDetailPage.classList.remove('hidden');
        renderComicDetail(comicId);
    }

    
    function renderComicCards(filteredComics) {
        comicGrid.innerHTML = ''; 
        if (filteredComics.length === 0) {
            comicGrid.innerHTML = '<p style="text-align: center; grid-column: 1 / -1; padding: 20px;">No comics found matching your criteria.</p>';
            return;
        }

        filteredComics.forEach(comic => {
            const card = document.createElement('div');
            card.classList.add('comic-card');
            card.setAttribute('data-id', comic.id);
            card.setAttribute('data-genre', comic.genres.map(g => g.toLowerCase()).join(' ')); 

            const tagsHtml = comic.genres.map(genre => `<span class="genre-tag-small">${genre}</span>`).join('');

            card.innerHTML = `
                <img src="${comic.imageUrl}" alt="${comic.title}">
                <div class="card-info">
                    <h3>${comic.title}</h3>
                    <p class="author">By ${comic.author}</p>
                    <div class="tags">${tagsHtml}</div>
                    <button class="read-more-btn" data-comic-id="${comic.id}">Read More</button>
                </div>
            `;
            comicGrid.appendChild(card);
        });

        
        document.querySelectorAll('.read-more-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                event.stopPropagation(); 
                const comicId = parseInt(event.target.dataset.comicId);
                showComicDetailPage(comicId);
            });
        });

        
        document.querySelectorAll('.comic-card').forEach(card => {
            card.addEventListener('click', (event) => {
                const comicId = parseInt(card.dataset.id);
                showComicDetailPage(comicId);
            });
        });
    }

    
    function renderComicDetail(comicId) {
        const comic = comicsData.find(c => c.id === comicId);

        if (!comic) {
            console.error('Comic not found:', comicId);
            showHomepage(); 
            return;
        }

        detailComicTitle.textContent = comic.title;
        detailComicAuthor.textContent = comic.author;
        detailComicDescription.textContent = `Description: ${comic.description}`;

        detailEpisodeList.innerHTML = '';

        comic.episodes.forEach(episode => {
            const li = document.createElement('li');
            const link = document.createElement('a');
            
            link.href = `episode-reader.html?comicId=${comic.id}&episodeId=${episode.id}`;
            link.classList.add('episode-link');
            link.textContent = `${episode.title}`;
            li.appendChild(link);
            detailEpisodeList.appendChild(li);
        });
    }


    
    genreTagsContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('genre-tag')) {
            document.querySelectorAll('.genre-tag').forEach(t => t.classList.remove('active'));
            event.target.classList.add('active'); 

            const selectedGenre = event.target.dataset.genre;
            filterComics(selectedGenre, searchInput.value);
        }
    });

    
    function filterComics(genre, searchTerm) {
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        const activeGenre = genre || document.querySelector('.genre-tag.active').dataset.genre;

        const filtered = comicsData.filter(comic => {
            const matchesSearch = comic.title.toLowerCase().includes(lowerCaseSearchTerm) ||
                                  comic.author.toLowerCase().includes(lowerCaseSearchTerm);

            const matchesGenre = (activeGenre === 'all') ||
                                 comic.genres.map(g => g.toLowerCase()).includes(activeGenre);

            return matchesSearch && matchesGenre;
        });
        renderComicCards(filtered);
    }

    searchInput.addEventListener('keyup', (event) => {
        filterComics(null, searchInput.value); 
    });

    searchButton.addEventListener('click', () => {
        filterComics(null, searchInput.value);
    });

    
    backToHomeFromDetailBtn.addEventListener('click', (event) => {
        event.preventDefault(); 
        showHomepage();
    });

    
    showHomepage(); 
    renderComicCards(comicsData); 

});