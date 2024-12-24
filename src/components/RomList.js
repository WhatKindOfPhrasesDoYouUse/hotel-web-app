import React, { useEffect, useState } from 'react';
import {Link, Route, useParams} from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RoomList = () => {
    const { id } = useParams(); // Получаем ID отеля из URL
    const navigate = useNavigate();
    const [rooms, setRooms] = useState([]); // Состояние для списка комнат
    const [isLoading, setIsLoading] = useState(false); // Состояние загрузки
    const [capacityFilter, setCapacityFilter] = useState(''); // Фильтр по вместимости
    const [minPriceFilter, setMinPriceFilter] = useState(''); // Фильтр по минимальной цене
    const [maxPriceFilter, setMaxPriceFilter] = useState(''); // Фильтр по максимальной цене
    const [roomTypeFilter, setRoomTypeFilter] = useState(''); // Фильтр по типу комнаты
    const [userRole, setUserRole] = useState(null); // Роль пользователя для проверки доступа

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            // Декодируем токен для получения роли пользователя
            const decodedToken = jwtDecode(token);
            const role = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
            console.log(role)
            setUserRole(role); // Сохраняем роль пользователя
        }

        setIsLoading(true);
        fetch(`http://localhost:5246/api/Room/GetAvailableRooms/${id}`)
            .then((res) => res.json())
            .then((data) => {
                setRooms(data);
                setIsLoading(false);
            })
            .catch((err) => {
                console.log(err);
                setIsLoading(false);
            });
    }, [id]);

    // Функция для удаления комнаты
    const deleteRoom = async (roomId) => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Вы не авторизованы.');
            return;
        }

        console.log(roomId);

        if (window.confirm("Вы уверены, что хотите удалить эту комнату?")) {
            try {
                await axios.delete(`http://localhost:5246/api/Room/DeleteRoomById/${roomId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setRooms(rooms.filter(room => room.id !== roomId));
            } catch (error) {
                console.error("Ошибка при удалении комнаты", error);
                alert("Ошибка при удалении комнаты.");
            }
        }
    };

    // Обработчик сортировки комнат по цене
    const handleSortByPrice = (descending) => {
        setIsLoading(true);
        const url = `http://localhost:5246/api/Room/SortedHotelsByPrice?hotelId=${id}&sortByPriceDescending=${descending}`;

        fetch(url)
            .then((res) => res.json())
            .then((data) => {
                setRooms(data);
                setIsLoading(false); // Отключаем загрузку
            })
            .catch((err) => {
                console.log('Ошибка при получении данных: ', err);
                setIsLoading(false); // Отключаем загрузку в случае ошибки
            });
    };

    // Обработчик отправки фильтров
    const handleFilterSubmit = () => {
        setIsLoading(true);
        let url = `http://localhost:5246/api/Room/FilteredRooms?hotelId=${id}&`;

        if (capacityFilter) url += `capacity=${capacityFilter}&`;
        if (minPriceFilter) url += `minPrice=${minPriceFilter}&`;
        if (maxPriceFilter) url += `maxPrice=${maxPriceFilter}&`;
        if (roomTypeFilter) url += `roomType=${roomTypeFilter}&`;

        fetch(url)
            .then((res) => res.json())
            .then((data) => {
                setRooms(data);
                setIsLoading(false);
            })
            .catch((err) => {
                console.log('Ошибка при загрузке фильтрованных данных:', err);
                setIsLoading(false);
            });
    };

    // Обработчик сброса фильтров
    const handleResetFilters = () => {
        setCapacityFilter('');
        setMinPriceFilter('');
        setMaxPriceFilter('');
        setRoomTypeFilter('');
        setIsLoading(true);

        fetch(`http://localhost:5246/api/Room/GetAvailableRooms/${id}`)
            .then((res) => res.json())
            .then((data) => {
                setRooms(data);
                setIsLoading(false);
            })
            .catch((err) => {
                console.log(err);
                setIsLoading(false);
            });
    };

    if (isLoading) {
        return <div>Загрузка...</div>;
    }

    if (!Array.isArray(rooms) || rooms.length === 0) {
        return <div>Нет доступных комнат</div>;
    }

    const handleAddRoom = () => {
        //navigate(`/add-room`, { state: { id } });
        navigate(`/add-room/${id}`);
    };

    return (
        <div className="room-list">
            <h2>Доступные комнаты в отеле</h2>

            {/* Форма фильтров */}
            <div className="filters">
                <input
                    type="number"
                    placeholder="Вместимость"
                    value={capacityFilter}
                    onChange={(e) => setCapacityFilter(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Мин. цена"
                    value={minPriceFilter}
                    onChange={(e) => setMinPriceFilter(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Макс. цена"
                    value={maxPriceFilter}
                    onChange={(e) => setMaxPriceFilter(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Тип комнаты"
                    value={roomTypeFilter}
                    onChange={(e) => setRoomTypeFilter(e.target.value)}
                />
                <button onClick={handleFilterSubmit}>Применить фильтр</button>
                <button onClick={handleResetFilters}>Сбросить фильтры</button>
            </div>

            {/* Кнопки сортировки */}
            <div className="sort-buttons">
                <button onClick={() => handleSortByPrice(false)}>Сортировать по цене (возрастание)</button>
                <button onClick={() => handleSortByPrice(true)}>Сортировать по цене (убывание)</button>
            </div>

            <div>
                <button onClick={handleAddRoom}>Добавить комнату</button>
            </div>


            {/* Отображение списка комнат */}
            <div className="rooms-container">
                {rooms.map((room) => (
                    <div className="room-card" key={room.id}>
                        <h3>{room.description}</h3>
                        <p>Тип комнаты: {room.roomType}</p>
                        <p>Номер комнаты: {room.roomNumber}</p>
                        <p>Вместимость: {room.capacity} человек</p>
                        <p>Цена: {room.price} руб.</p>
                        {/* Кнопка удаления доступна только для админов */}
                        {userRole === 'admins' && (
                            <button onClick={() => deleteRoom(room.id)}>Удалить</button>
                        )}
                    </div>
                ))}
            </div>

        </div>
    );
};

export default RoomList;