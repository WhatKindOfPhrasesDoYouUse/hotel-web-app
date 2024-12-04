import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

const RoomList = () => {
    const { id } = useParams();
    const [rooms, setRooms] = useState([]);

    useEffect(() => {
        fetch(`http://localhost:5246/api/Room/GetAvailableRooms/${id}`)
            .then((res) => res.json())
            .then((data) => setRooms(data))
            .catch((err) => console.log(err));
    }, [id]);

    if (!Array.isArray(rooms)) {
        return <div>Ошибка при загрузке комнат</div>;
    }

    if (!rooms.length) {
        return <div>Нет доступных комнат</div>;
    }

    return (
        <div className="room-list">
            <h2>Доступные комнаты </h2>
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
