import React, { useState } from 'react';
import {useParams} from "react-router-dom";

const AddRoom = () => {
    const { id } = useParams();
    const [formData, setFormData] = useState({
        roomType: '',
        roomNumber: '',
        capacity: '',
        description: '',
        price: '',
        hotelId: id
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch('http://localhost:5246/api/Room/AddRoom', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        })
            .then((response) => {
                if (response.ok) {
                    alert('Отель успешно добавлен');
                } else {
                    alert('Ошибка при добавлении отеля');
                }
            })
            .catch((error) => {
                console.log('Ошибка: ', error);
            })
    };

    return (
        <div>
            <h1>Добавить комнату</h1>
            <form onSubmit={handleSubmit} className="form-container">
                <input
                    type="text"
                    name="roomType"
                    placeholder="Тип комнаты"
                    value={formData.roomType}
                    onChange={handleChange}
                    required
                />
                <input
                    type="number"
                    name="roomNumber"
                    placeholder="Номер комнаты"
                    value={formData.roomNumber}
                    onChange={handleChange}
                    required
                />
                <input
                    type="number"
                    name="capacity"
                    placeholder="Вместимость"
                    value={formData.capacity}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="description"
                    placeholder="Описание"
                    value={formData.description}
                    onChange={handleChange}
                />
                <input
                    type="number"
                    step="0.01"
                    name="price"
                    placeholder="Цена"
                    value={formData.price}
                    onChange={handleChange}
                    required
                />
               {/* <input
                    type="number"
                    name="hotelId"
                    placeholder="ID отеля"
                    value={formData.hotelId}
                    onChange={id}
                    required
                    disabled
                />*/}
                <button type="submit">Добавить комнату</button>
            </form>
        </div>
    );
};

export default AddRoom;