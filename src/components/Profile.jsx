import React from 'react';
import FavoritesList from './FavoritesList';
import User from './User';

const Profile = () => {
    return (
        <div>
            <User></User>
            <FavoritesList></FavoritesList>
        </div>
    );
};

export default Profile;