import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const RoomList = () => {
    const { id } = useParams(); // Получаем ID отеля из URL
    const [rooms, setRooms] = useState([]); // Состояние для списка комнат
    const [isLoading, setIsLoading] = useState(false); // Состояние загрузки
    const [capacityFilter, setCapacityFilter] = useState(''); // Фильтр по вместимости
    const [minPriceFilter, setMinPriceFilter] = useState(''); // Фильтр по минимальной цене
    const [maxPriceFilter, setMaxPriceFilter] = useState(''); // Фильтр по максимальной цене
    const [roomTypeFilter, setRoomTypeFilter] = useState(''); // Фильтр по типу комнаты

    // Загрузка всех доступных комнат при первой загрузке страницы
    useEffect(() => {
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

            {/* Отображение списка комнат */}
            <div className="rooms-container">
                {rooms.map((room) => (
                    <div className="room-card" key={room.id}>
                        <h3>{room.description}</h3>
                        <p>Тип комнаты: {room.roomType}</p>
                        <p>Номер комнаты: {room.roomNumber}</p>
                        <p>Вместимость: {room.capacity} человек</p>
                        <p>Цена: {room.price} руб.</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RoomList;
