import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const BookRoom = () => {
    const { roomId } = useParams(); // Получаем ID комнаты из URL
    const navigate = useNavigate();
    const [room, setRoom] = useState(null); // Состояние для информации о комнате
    const [formData, setFormData] = useState({
        checkIn: '',
        checkOut: '',
        actualPrice: '',
        userAccountId: '',
        roomId: roomId
    });

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken = jwtDecode(token);
            const email = decodedToken.sub;
            console.log(decodedToken);

            // Получаем данные пользователя на основе email
            fetch(`http://127.0.0.1:5246/api/UserAccount/GetUserByEmail/${email}`)
                .then((res) => res.json())
                .then((data) => {
                    console.log('User data:', data);
                    setFormData((prevData) => ({
                        ...prevData,
                        userAccountId: data.id
                    }));
                })
                .catch((err) => {
                    console.error('Ошибка при получении данных пользователя:', err);
                });
        }

        // Загрузка информации о комнате
        fetch(`http://127.0.0.1:5246/api/Room/GetRoomById/${roomId}`)
            .then((res) => res.json())
            .then((data) => {
                setRoom(data);
                setFormData((prevData) => ({
                    ...prevData,
                    actualPrice: data.price
                }));
            })
            .catch((err) => {
                console.error('Ошибка при получении данных комнаты:', err);
            });
    }, [roomId]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token'); // Получаем токен из localStorage

        if (!token) {
            alert('Токен не найден. Пожалуйста, авторизуйтесь.');
            return;
        }

        console.log('Sending data:', formData); // Логирование данных запроса

        try {
            const response = await fetch('http://127.0.0.1:5246/api/Booking/AddBooking', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Добавляем токен в заголовок
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                alert('Бронирование успешно создано');
                navigate('/'); // Перенаправляем на главную страницу после успешного бронирования
            } else {
                const errorData = await response.json();
                alert(`Ошибка при создании бронирования: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Произошла ошибка при отправке запроса.');
        }
    };

    if (!room) {
        return <div>Загрузка...</div>;
    }

    return (
        <div>
            <h1>Бронирование комнаты</h1>
            <h2>{room.description}</h2>
            <p>Тип комнаты: {room.roomType}</p>
            <p>Номер комнаты: {room.roomNumber}</p>
            <p>Вместимость: {room.capacity} человек</p>
            <p>Цена: {room.price} руб.</p>

            <form onSubmit={handleSubmit}>
                <input type="date" name="checkIn" placeholder="Дата заезда" value={formData.checkIn} onChange={handleChange} required />
                <input type="date" name="checkOut" placeholder="Дата выезда" value={formData.checkOut} onChange={handleChange} required />
                <button type="submit">Забронировать</button>
            </form>
        </div>
    );
};

export default BookRoom;
