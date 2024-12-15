import React, { useState, useEffect } from 'react';
import {Link, redirect} from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const UserProfile = () => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false); // Состояние для редактирования
    const [userData, setUserData] = useState({
        id: '',
        firstName: '',
        lastName: '',
        surname: '',
        email: '',
        phoneNumber: '',
        passport: '',
        password: ''
    }); // Данные для редактирования

    // Получение токена из localStorage
    const getToken = () => {
        return localStorage.getItem('token');
    };

    const logout = () => {
        localStorage.removeItem('token');
    };

    // Получение данных пользователя
    useEffect(() => {
        const token = getToken();
        if (!token) {
            console.error('Токен отсутствует');
            return;
        }

        try {
            const decoded = jwtDecode(token); // Распаковываем токен
            const email = decoded.sub; // email хранится в токене
            console.log(email);
            fetchUserData(email);
        } catch (error) {
            console.error('Ошибка декодирования токена:', error);
        }
    }, []);

    const fetchUserData = async (email) => {
        setIsLoading(true);
        try {
            const response = await fetch(`http://localhost:5246/api/UserAccount/GetUserByEmail/${email}`);
            if (!response.ok) {
                throw new Error('Ошибка при загрузке данных пользователя');
            }
            const data = await response.json();
            setUser(data);
            setUserData({
                id: data.id,
                firstName: data.firstName,
                lastName: data.lastName,
                surname: data.surname,
                email: data.email,
                phoneNumber: data.phoneNumber,
                passport: data.passport,
                password: data.password
            });
        } catch (error) {
            console.error('Ошибка загрузки данных пользователя:', error);
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        setUserData({
            ...userData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const token = getToken();
        try {
            const response = await fetch(`http://localhost:5246/api/UserAccount/UpdateUser/${user.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(userData)
            });

            if (!response.ok) {
                throw new Error('Ошибка при обновлении данных пользователя');
            }

            // Если все прошло успешно, получаем обновленные данные
            const updatedUser = await response.json();
            setUser(updatedUser);
            setIsEditing(false); // Закрываем режим редактирования
        } catch (error) {
            console.error('Ошибка обновления данных пользователя:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return <div>Загрузка...</div>;
    }

    if (!user) {
        return <div>Ошибка загрузки данных пользователя.</div>;
    }

    return (
        <div>
            <header>
                <h1>Личный кабинет</h1>
            </header>
            {isEditing ? (
                <div>
                    <h2>Редактирование данных</h2>
                    <form onSubmit={handleSubmit}>
                        <div>
                            <label>Имя:</label>
                            <input
                                type="text"
                                name="firstName"
                                value={userData.firstName}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label>Фамилия:</label>
                            <input
                                type="text"
                                name="lastName"
                                value={userData.lastName}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label>Отчество:</label>
                            <input
                                type="text"
                                name="surname"
                                value={userData.surname}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label>Email:</label>
                            <input
                                type="email"
                                name="email"
                                value={userData.email}
                                disabled
                            />
                        </div>
                        <div>
                            <label>Номер телефона:</label>
                            <input
                                type="text"
                                name="phoneNumber"
                                value={userData.phoneNumber}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label>Паспорт:</label>
                            <input
                                type="text"
                                name="passport"
                                value={userData.passport}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label>Пароль:</label>
                            <input
                                type="text"
                                name="password"
                                value={userData.password}
                                onChange={handleChange}
                            />
                        </div>
                        <button type="submit">Сохранить изменения</button>
                        <button type="button" onClick={() => setIsEditing(false)}>
                            Отменить
                        </button>
                    </form>
                </div>
            ) : (
                <div>
                    <h2>Информация о пользователе</h2>
                    <p><strong>Имя:</strong> {user.firstName}</p>
                    <p><strong>Фамилия:</strong> {user.lastName}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Номер телефона:</strong> {user.phoneNumber}</p>
                    <p><strong>Паспорт:</strong> {user.passport}</p>

                    <h2>Действия</h2>
                    <button onClick={() => setIsEditing(true)}>Редактировать</button>
                    <button onClick={logout}>Выйти</button>
                </div>
            )}
        </div>
    );
};

export default UserProfile;
