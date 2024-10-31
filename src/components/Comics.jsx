// comics.jsx
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
    const PUBLIC_KEY = process.env.REACT_APP_MARVEL_PUBLIC_KEY;
    const BASE_URL = 'https://gateway.marvel.com/v1/public/comics';

    useEffect(() => {
        const fetchComics = async () => {
            try {
                const response = await fetch(
                    `${BASE_URL}?orderBy=-modified&limit=20&apikey=${PUBLIC_KEY}`
                );
                if (!response.ok) {
                    throw new Error("Error fetching data");
                }
                const data = await response.json();

                const sortedComics = data.data.results.sort((a, b) =>
                    new Date(b.modified) - new Date(a.modified)
                );

                setComics(sortedComics);
            } catch (error) {
                console.error("Error fetching comics:", error);
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
            ? favorites.filter(id => id !== comicId) // Eliminar de favoritos
            : [...favorites, comicId]; // Agregar a favoritos

        setFavorites(newFavorites); // Actualiza el estado de favoritos
        localStorage.setItem('favorites', JSON.stringify(newFavorites)); // Actualiza localStorage
    };

    return (
        <div>
            <div className="gridStyle">
                {comics.map((comic) => {
                    const isFavorite = favorites.includes(comic.id);
                    const cardClass = isFavorite ? 'comicCardStyle favoriteCard' : 'comicCardStyle'; // Clase condicional

                    return (
                        <div className={cardClass} key={comic.id}>
                            <div onClick={() => handleComicClick(comic)}> {/* Cambiado a función de flecha */}
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
                                        e.stopPropagation(); // Evitar que el click del botón dispare el evento de la tarjeta
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
            {selectedComic && (
                <ComicDetails comic={selectedComic} onClose={handleCloseDetails} />
            )}
        </div>
    );
};

export default Comics;