import React, { useState, useEffect } from 'react';
import './Comics.css';
import ComicDetails from './ComicDetails';

const Profile = () => {
    const [comics, setComics] = useState([]);
    const [selectedComic, setSelectedComic] = useState(null);
    const [favorites, setFavorites] = useState(() => JSON.parse(localStorage.getItem('favorites')) || []);
    const [isLoading, setIsLoading] = useState(true);

    const PUBLIC_KEY = process.env.REACT_APP_MARVEL_PUBLIC_KEY;
    const BASE_URL = 'https://gateway.marvel.com/v1/public/comics';

    useEffect(() => {
        const fetchFavoriteComics = async () => {
            const comicsData = [];

            for (let comicId of favorites) {
                try {
                    const response = await fetch(`${BASE_URL}/${comicId}?apikey=${PUBLIC_KEY}`);
                    const data = await response.json();
                    comicsData.push(data.data.results[0]);
                } catch (error) {
                    console.error("Error fetching favorite comic:", error);
                }
            }
            setComics(comicsData);
            setIsLoading(false);
        };

        fetchFavoriteComics();
    }, [PUBLIC_KEY, favorites]);

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
            <h2 className="whiteTitle">Mis Cómics Favoritos</h2>
            {isLoading ? (
                <p className="loadingMessage">Loading</p> 
            ) : (
                <div className="gridStyle">
                    {comics.map((comic) => (
                        <div
                            key={comic.id}
                            className={`comicCardStyle ${favorites.includes(comic.id) ? 'favoriteCard' : ''}`}
                        >
                            <div onClick={() => handleComicClick(comic)}>
                                <div className="comicTitle">
                                    <h3>{comic.title}</h3>
                                </div>
                                <p>{formatDate(comic.modified.slice(0, 10)) || "Fecha no disponible"}</p>
                                {comic.thumbnail && (
                                    <img
                                        src={`${comic.thumbnail.path}.${comic.thumbnail.extension}`}
                                        alt={comic.title}
                                        style={{ width: "100%" }}
                                    />
                                )}
                            </div>
                            <button
                                className={`favoriteButton ${favorites.includes(comic.id) ? 'favorite' : 'notFavorite'}`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleFavorite(comic.id);
                                }}
                            >
                                {favorites.includes(comic.id) ? '❤️' : '🤍'}
                            </button>
                        </div>
                    ))}
                </div>
            )}
            {selectedComic && (
                <ComicDetails comic={selectedComic} onClose={handleCloseDetails} />
            )}
        </div>
    );
};

export default Profile;