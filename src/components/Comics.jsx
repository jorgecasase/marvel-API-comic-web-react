import React, { useState, useEffect } from 'react';
import ComicDetails from './ComicDetails';
import './Comics.css';
import './ComicDetails.css';

const Comics = () => {
    const [comics, setComics] = useState([]);
    const [selectedComic, setSelectedComic] = useState(null);
    const [favorites, setFavorites] = useState(() => {
        return JSON.parse(localStorage.getItem('favorites')) || [];
    });
    const [isLoading, setIsLoading] = useState(true);
    const PUBLIC_KEY = process.env.REACT_APP_MARVEL_PUBLIC_KEY;
    const BASE_URL = 'https://gateway.marvel.com/v1/public/comics';

    useEffect(() => {
        const fetchComics = async () => {
            try {
                const response = await fetch(
                    `${BASE_URL}?orderBy=-modified&limit=60&apikey=${PUBLIC_KEY}`
                );
                if (!response.ok) {
                    throw new Error("Error fetching data");
                }
                const data = await response.json();
                const validComics = data.data.results.filter(comic =>
                    comic.modified && !isNaN(new Date(comic.modified))
                );
                const sortedComics = validComics.sort((a, b) =>
                    new Date(b.modified) - new Date(a.modified)
                );

                setComics(sortedComics);
            } catch (error) {
                console.error("Error fetching comics:", error);
            }
            finally{
                setIsLoading(false);
            }
        };
        fetchComics();
    }, [PUBLIC_KEY]);

    const formatDate = (dateString) => {
        const parts = dateString.split('-');
        return `${parts[2]}-${parts[1]}-${parts[0]}`;
    };

    const handleComicClick = (comic) => {
        setSelectedComic(comic);
    };

    const handleCloseDetails = () => {
        setSelectedComic(null);
    };

    const handleFavorite = (comicId) => {
        const newFavorites = favorites.includes(comicId)
            ? favorites.filter(id => id !== comicId)
            : [...favorites, comicId];

        setFavorites(newFavorites);
        localStorage.setItem('favorites', JSON.stringify(newFavorites));
    };

    return (
        <div>
            {isLoading ? ( 
                <p className="loadingMessage">Loading...</p>
            ) : (
                <div className="gridStyle">
                    {comics.map((comic) => {
                        const isFavorite = favorites.includes(comic.id);
                        const cardClass = isFavorite ? 'comicCardStyle favoriteCard' : 'comicCardStyle';

                        return (
                            <div className={cardClass} key={comic.id}>
                                <div onClick={() => handleComicClick(comic)}>
                                    <div className="comicTitle">
                                        <h3>{comic.title}</h3>
                                    </div>

                                    <p>{formatDate(comic.modified.slice(0, 10)) || "Fecha de modificación no disponible"}</p>
                                    {comic.thumbnail && (
                                        <img
                                            src={`${comic.thumbnail.path}.${comic.thumbnail.extension}`}
                                            alt={comic.title}
                                            style={{ width: "100%" }}
                                        />
                                    )}
                                </div>
                                <div>
                                    <button
                                        className={`favoriteButton ${isFavorite ? 'favorite' : 'notFavorite'}`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleFavorite(comic.id);
                                        }}
                                    >
                                        {isFavorite ? '❤️' : '🤍'}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
            {selectedComic && (
                <ComicDetails comic={selectedComic} onClose={handleCloseDetails} />
            )}
        </div>
    );
};

export default Comics;
