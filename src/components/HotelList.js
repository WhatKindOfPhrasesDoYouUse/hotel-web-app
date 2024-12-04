import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Исправленный импорт

const HotelList = () => {
    const [hotels, setHotels] = useState([]); // Состояние для хранения информации о гостинице
    const [roomCount, setRoomCount] = useState({}); // Хранение количества комнат для каждого отеля

    // Получение списка отелей
    useEffect(() => {
        fetch('http://localhost:5246/api/Hotel/GetHotels') // URL GET метода API
            .then(res => res.json()) // преобразую ответ в JSON
            .then(data => setHotels(data)) // устанавливаю полученные данные в состояние
            .catch(err => console.log(err)); // ловлю ошибку, если запрос не удался
    }, []);

    // Получение количества доступных комнат для каждого отеля
    useEffect(() => {
        if (hotels.length > 0) {
            const fetchRoomCounts = async () => {
                const counts = {};
                for (const hotel of hotels) {
                    const response = await fetch(`http://localhost:5246/api/Room/GetAvailableRoomsCount/${hotel.id}`);
                    const count = await response.json();
                    counts[hotel.id] = count; // Сохраняем количество комнат по каждому отелю
                }
                setRoomCount(counts); // Обновляем состояние с количеством комнат
            };

            fetchRoomCounts();
        }
    }, [hotels]); // Запрос количества комнат после получения списка отелей

    if (hotels.length === 0) {
        return <div>Загрузка отелей...</div>;
    }

    return (
        <div>
            <h1>Список отелей</h1>
            {hotels.map((hotel) => (
                <div key={hotel.id}>
                    <h2>{hotel.name}</h2>
                    <p>Адрес: {hotel.address}</p>
                    <p>Город: {hotel.city}</p>
                    <p>Номер телефона: {hotel.phoneNumber}</p>
                    <p>Почта: {hotel.email}</p>
                    <p>Рейтинг: {hotel.rating}</p>
                    <p>Описание: {hotel.description}</p>
                    <p>Доступные комнаты: {roomCount[hotel.id]}</p> {/* Показываем количество доступных комнат */}
                    <Link to={`/hotel/${hotel.id}/reviews`}>
                        <button>Посмотреть отзывы</button>
                    </Link>
                    <Link to={`/hotel/${hotel.id}/rooms`}>
                        <button>Посмотреть доступные комнаты</button>
                    </Link>
                    <hr />
                </div>
            ))}
        </div>
    );
}

export default HotelList;
