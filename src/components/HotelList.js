import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Исправлено на правильный импорт

const HotelList = () => {
    const [hotels, setHotels] = useState(null); // Состояние для хранения информации о гостинице

    useEffect(() => {
        fetch('http://localhost:5246/api/Hotel/GetHotels') // URL GET метода API
            .then(res => res.json()) // преобразую ответ в JSON (хотя зачем если он уже в JSON приходит)
            .then(data => setHotels(data)) // устанавливаю полученные данные в состояние на момент выполнения
            .catch(err => console.log(err)); // ловлю ошибку, если запрос не удался
    }, [])

    if (!hotels) {
        return <div>Загрузка отелей</div>
    }

    // вывожу коллекцию json объектов
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
                    <Link to={`/hotel/${hotel.id}/reviews`}> {/* Исправленный путь */}
                        <button>Посмотреть отзывы</button>
                    </Link>
                    <hr/>
                </div>
            ))}
        </div>
    );
}

export default HotelList;