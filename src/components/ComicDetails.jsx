import React from 'react';
import './ComicDetails.css';
import { useState } from 'react';

const ComicDetails = ({ comic, onClose }) => {
    const [favorites, setFavorites] = useState(JSON.parse(localStorage.getItem('favorites')) || []);
    const isFavorite = favorites.includes(comic.id);
    if (!comic) return null;

    const handleFavorite = () => {
        let updatedFavorites;
        if (isFavorite) {
            updatedFavorites = favorites.filter(id => id !== comic.id);
        } else {
            updatedFavorites = [...favorites, comic.id];
        }
        setFavorites(updatedFavorites);
        localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
        console.log(localStorage.getItem('favorites'));
    };

    return (
        <div className="modalOverlay" onClick={onClose}>
            <div className="comicDetails" onClick={(e) => e.stopPropagation()}>
                <div className="comicCard">
                    <div className="titulo">
                        <h2>{comic.title}</h2>
                        {comic.thumbnail && (
                            <img
                                src={`${comic.thumbnail.path}.${comic.thumbnail.extension}`}
                                alt={comic.title}
                                className="comicImage"
                            />
                        )}<br></br>
                        <button
                            className={`favoriteButton ${isFavorite ? 'favorite' : 'notFavorite'}`}
                            onClick={handleFavorite}
                        >
                            {isFavorite ? '❤️' : '🤍'}
                        </button>
                    </div>
                </div>
                <p><strong>Fecha de modificación:</strong> {comic.modified.slice(0, 10)}</p>
                <p><strong>Descripción:</strong> {comic.description || "descripción no disponible"}</p>
                <p><strong>Páginas:</strong> {comic.pageCount || "Información no disponible"}</p>
                <p><strong>ISSN:</strong> {comic.issn || "Información no disponible"}</p>
                {comic.collections.length > 0 ? (
                    <div>
                        <h3>Colecciones:</h3>
                        <ul>
                            {comic.collections.map((collection) => (
                                <li key={collection.resourceURI}>{collection.name}</li>
                            ))}
                        </ul>
                    </div>
                ) : (console.log("No hay colecciones disponibles")
                )}
                <h3>Creadores:</h3>
                <ul>
                    {comic.creators.items.length > 0 ? (
                        comic.creators.items.map((creator) => (
                            <li key={creator.resourceURI}>
                                {creator.name} ({creator.role})
                            </li>
                        ))
                    ) : (
                        console.log("No hay creadores disponibles")
                    )}
                </ul>

                <h3>Personajes:</h3>
                <div className="charactersContainer">
                    {comic.characters.items.map((character) => (
                        <div key={character.resourceURI} className="characterCard">
                            <CharacterImage characterUri={character.resourceURI} />
                            <p>{character.name}</p>
                        </div>
                    ))}
                </div>

                <div className="botones">
                    <button className="closeButton" onClick={onClose}>Cerrar</button>
                </div>

            </div>
        </div>
    );
};

const CharacterImage = ({ characterUri }) => {
    const [character, setCharacter] = React.useState(null);

    React.useEffect(() => {
        const fetchCharacter = async () => {
            const response = await fetch(`${characterUri}?apikey=${process.env.REACT_APP_MARVEL_PUBLIC_KEY}`);
            const data = await response.json();
            setCharacter(data.data.results[0]);
        };
        fetchCharacter();
    }, [characterUri]);

    if (!character) return null;

    return (
        <img
            src={`${character.thumbnail.path}.${character.thumbnail.extension}`}
            alt={character.name}
            className="characterImage"
        />
    );
};

export default ComicDetails;