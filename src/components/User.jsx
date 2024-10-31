// User.jsx
import React, { useState } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import './User.css';

const User = () => {
    const [isRegistered, setIsRegistered] = useState(() => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    });

    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            password: '',
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Nombre es requerido'),
            email: Yup.string().email('Email inválido').required('Email es requerido'),
            password: Yup.string().min(6, 'La contraseña debe tener al menos 6 caracteres').required('Contraseña es requerida'),
        }),
        onSubmit: (values) => {
            localStorage.setItem('user', JSON.stringify(values));
            setIsRegistered(values);
        },
    });

    const handleLogout = () => {
        localStorage.removeItem('user');
        setIsRegistered(null); // Restablece el estado de registro
    };

    const downloadCSV = async () => {
        const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        const comicsData = [];

        for (let id of favorites) {
            try {
                const response = await fetch(`https://gateway.marvel.com/v1/public/comics/${id}?apikey=${process.env.REACT_APP_MARVEL_PUBLIC_KEY}`);
                const data = await response.json();
                const comic = data.data.results[0];
                comicsData.push({
                    id: comic.id,
                    title: comic.title,
                    description: comic.description || "Sin descripción", // Manejo de posibles nulls
                    pageCount: comic.pageCount || "No disponible",
                    modified: comic.modified.slice(0, 10), // Formato de fecha
                });
            } catch (error) {
                console.error("Error fetching comic data:", error);
            }
        }

        const csvContent = [
            ['ID', 'Título', 'Descripción', 'Número de Páginas', 'Fecha de Modificación'], // Encabezados
            ...comicsData.map(comic => [comic.id, comic.title, comic.description, comic.pageCount, comic.modified]) // Cada fila de datos
        ]
        .map(e => e.join(","))
        .join("\n");

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'favoritos.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (isRegistered) {
        return (
            <div>
                <p id="mensajeBienvenida">Bienvenido, {isRegistered.name}!</p>
                <button id="cerrarSesion" onClick={handleLogout}>Cerrar sesión</button>
                <button onClick={downloadCSV}>Descargar CSV de favoritos</button>
            </div>
        );
    }

    return (
        <div className="userContainer">
            <p>No te pierdas tu lista de favoritos</p>
            <form onSubmit={formik.handleSubmit}>
                <input
                    type="text"
                    name="name"
                    placeholder="Nombre"
                    onChange={formik.handleChange}
                    value={formik.values.name}
                />
                {formik.errors.name && <p className="errorMessage">{formik.errors.name}</p>}

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    onChange={formik.handleChange}
                    value={formik.values.email}
                />
                {formik.errors.email && <p className="errorMessage">{formik.errors.email}</p>}

                <input
                    type="password"
                    name="password"
                    placeholder="Contraseña"
                    onChange={formik.handleChange}
                    value={formik.values.password}
                />
                {formik.errors.password && <p className="errorMessage">{formik.errors.password}</p>}

                <button type="submit">Registrarse</button>
            </form>
        </div>
    );
};

export default User;