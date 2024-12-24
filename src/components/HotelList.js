import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

// TODO: 1. Пофиксить ошибку с удалением отеля, удаление из бд работает, но в консоль кидает ошибку, после обновления страницы отель так же изчезает из фронтенда

const HotelList = () => {
    const [hotels, setHotels] = useState([]); // Состояние для хранения информации о гостиницах
    const [roomCount, setRoomCount] = useState({}); // Хранение количества комнат для каждого отеля
    const [cityFilter, setCityFilter] = useState(''); // Фильтр по городу
    const [ratingFilter, setRatingFilter] = useState(''); // Фильтр по рейтингу
    const [minAvailableRoomsFilter, setMinAvailableRoomsFilter] = useState(''); // Фильтр по минимальному количеству комнат
    const [isLoading, setIsLoading] = useState(false); // Состояние для загрузки
    const [sortByRatingDescending, setSortByRatingDescending] = useState(null); // Состояние для сортировки
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    // Обработчик изменения фильтра по городу
    const handleCityFilterChange = (e) => {
        setCityFilter(e.target.value);
    };

    // Обработчик изменения фильтра по рейтингу
    const handleRatingFilterChange = (e) => {
        setRatingFilter(e.target.value);
    };

    // Обработчик изменения фильтра по минимальному количеству комнат
    const handleMinAvailableRoomsChange = (e) => {
        setMinAvailableRoomsFilter(e.target.value);
    };

    useEffect(() => {
        const token = localStorage.getItem('token'); // Предположим, что токен хранится в localStorage
        if (token) {
            setIsAuthenticated(true); // Если токен найден, считаем, что пользователь авторизован

            try {
                const decodedToken = jwtDecode(token);
                const role = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
                console.log(role)
                if (role && role === 'admins') {
                    setIsAdmin(true);
                }
            } catch (err) {
                console.error('Ошибка при расшифровке токена: ', err);
            }
        }
    }, []);


    // Функция для применения фильтров
    const handleFilterSubmit = () => {
        setIsLoading(true); // Включаем загрузку

        let url = 'http://localhost:5246/api/Hotel/FilteredHotels?';

        if (cityFilter) url += `city=${cityFilter}&`;
        if (ratingFilter) url += `rating=${ratingFilter}&`;
        if (minAvailableRoomsFilter) url += `minAvailableRooms=${minAvailableRoomsFilter}&`;

        fetch(url)
            .then(res => res.json())
            .then(data => {
                setHotels(data);
                setIsLoading(false); // Отключаем загрузку
            })
            .catch(err => {
                console.log('Ошибка при получении данных: ', err);
                setIsLoading(false); // Отключаем загрузку в случае ошибки
            });
    };

    // Функция для удаления отеля
    const handleDeleteHotel = (hotelId) => {
        setIsLoading(true);
        const url = `http://localhost:5246/api/Hotel/DeleteHotelById/${hotelId}`;

        fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setHotels(hotels.filter(hotel => hotel.id !== hotelId));
                } else {
                    console.error('Ошибка при удалении отеля: ', data.message);
                }
                setIsLoading(false); // Отключаем загрузку
            })
            .catch(err => {
                console.log('Ошибка при удалении отеля: ', err);
                setIsLoading(false); // Отключаем загрузку в случае ошибки
            });
    };

    // Функция для сброса фильтров
    const handleResetFilters = () => {
        setCityFilter('');
        setRatingFilter('');
        setMinAvailableRoomsFilter('');
        setIsLoading(true);

        // Возвращаем все отели при сбросе фильтров
        fetch('http://localhost:5246/api/Hotel/GetHotels')
            .then(res => res.json())
            .then(data => {
                setHotels(data);
                setIsLoading(false); // Отключаем загрузку
            })
            .catch(err => {
                console.log('Ошибка при получении данных: ', err);
                setIsLoading(false); // Отключаем загрузку в случае ошибки
            });
    };

    // Функция для сортировки отелей
    const handleSortByRating = (descending) => {
        setIsLoading(true);
        const url = `http://localhost:5246/api/Hotel/SortedHotelsByRating?sortByRatingDescending=${descending}`;

        fetch(url)
            .then(res => res.json())
            .then(data => {
                setHotels(data);
                setIsLoading(false); // Отключаем загрузку
            })
            .catch(err => {
                console.log('Ошибка при получении данных: ', err);
                setIsLoading(false); // Отключаем загрузку в случае ошибки
            });
    };


    // Получение списка отелей без фильтров (когда фильтры не применяются)
    useEffect(() => {
        if (hotels.length === 0 && cityFilter === '' && ratingFilter === '' && minAvailableRoomsFilter === '') {
            setIsLoading(true);
            fetch('http://localhost:5246/api/Hotel/GetHotels')
                .then(res => res.json())
                .then(data => {
                    setHotels(data);
                    setIsLoading(false); // Завершаем загрузку
                })
                .catch(err => {
                    console.log('Ошибка при получении данных: ', err);
                    setIsLoading(false); // Завершаем загрузку в случае ошибки
                });
        }
    }, [hotels.length, cityFilter, ratingFilter, minAvailableRoomsFilter]); // Этот useEffect будет вызван, если отели еще не загружены

    // Получение количества доступных комнат для каждого отеля
    useEffect(() => {
        if (hotels.length > 0) {
            const fetchRoomCounts = async () => {
                const counts = {};
                for (const hotel of hotels) {
                    const response = await fetch(`http://localhost:5246/api/Room/GetAvailableRoomsCount/${hotel.id}`);
                    const count = await response.json();
                    counts[hotel.id] = count;
                }
                setRoomCount(counts); // Обновляем состояние с количеством комнат
            };

            fetchRoomCounts();
        }
    }, [hotels]);

    return (
        <div>
            <h1>Список отелей</h1>

            {/* Поля фильтров */}
            <div>
                <input
                    type="text"
                    placeholder="Город"
                    value={cityFilter}
                    onChange={handleCityFilterChange}
                />
                <input
                    type="number"
                    placeholder="Рейтинг"
                    value={ratingFilter}
                    onChange={handleRatingFilterChange}
                />
                <input
                    type="number"
                    placeholder="Минимум комнат"
                    value={minAvailableRoomsFilter}
                    onChange={handleMinAvailableRoomsChange}
                />
            </div>

            {isAuthenticated && (
                <Link to="/profile">
                    <button>Перейти в личный кабинет</button>
                </Link>
            )}

            {!isAuthenticated && (
                <Link to="/login">
                    <button>Авторизоваться</button>
                </Link>
            )}

            {isAdmin && (
                <Link to="/add-hotel">
                    <button>Добавить новый отель</button>
                </Link>
            )}


            {/* Кнопка для применения фильтра */}
            <button onClick={handleFilterSubmit}>Применить фильтр</button>

            {/* Кнопка для сброса фильтров */}
            <button onClick={handleResetFilters}>Сбросить фильтры</button>

            {/* Кнопка для сортировки по рейтингу */}
            <div>
                <button onClick={() => handleSortByRating(true)}>Сортировать по рейтингу (убывание)</button>
                <button onClick={() => handleSortByRating(false)}>Сортировать по рейтингу (возрастание)</button>
            </div>

            {/* Отображение состояния загрузки */}
            {isLoading ? (
                <div>Загрузка...</div>
            ) : (
                <div>
                    {Array.isArray(hotels) && hotels.map((hotel) => (
                        <div key={hotel.id}>
                            <h2>{hotel.name}</h2>
                            <p>Адрес: {hotel.address}</p>
                            <p>Город: {hotel.city}</p>
                            <p>Номер телефона: {hotel.phoneNumber}</p>
                            <p>Почта: {hotel.email}</p>
                            <p>Рейтинг: {hotel.rating}</p>
                            <p>Описание: {hotel.description}</p>
                            <p>Доступные комнаты: {roomCount[hotel.id]}</p>
                            <Link to={`/hotel/${hotel.id}/reviews`}>
                                <button>Посмотреть отзывы</button>
                            </Link>
                            <Link to={`/hotel/${hotel.id}/rooms`}>
                                <button>Посмотреть доступные комнаты</button>
                            </Link>
                            {isAdmin && (
                                <button onClick={() => handleDeleteHotel(hotel.id)}>Удалить отель</button>
                            )}
                            <hr />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default HotelList;