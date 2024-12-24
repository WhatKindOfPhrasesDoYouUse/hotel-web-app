import React, { useState } from 'react';
import { jwtDecode } from 'jwt-decode';

const AddHotel = () => {
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        city: '',
        description: '',
        phoneNumber: '',
        email: '',
        constructionYear: '',
        rating: '',
        managerId: '',
        hotelTypeId: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token'); // Получаем токен из localStorage

        if (!token) {
            alert('Токен не найден. Пожалуйста, авторизуйтесь.');
            return;
        }

        fetch('http://localhost:5246/api/Hotel/AddHotel', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Добавляем токен в заголовок
            },
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
                console.error('Ошибка:', error);
            });
    };

    return (
        <div>
            <h1>Добавить отель</h1>
            <form onSubmit={handleSubmit}>
                <input type="text" name="name" placeholder="Название" value={formData.name} onChange={handleChange} required />
                <input type="text" name="address" placeholder="Адрес" value={formData.address} onChange={handleChange} required />
                <input type="text" name="city" placeholder="Город" value={formData.city} onChange={handleChange} required />
                <input type="text" name="description" placeholder="Описание" value={formData.description} onChange={handleChange} />
                <input type="text" name="phoneNumber" placeholder="Телефон" value={formData.phoneNumber} onChange={handleChange} required />
                <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                <input type="date" name="constructionYear" placeholder="Год постройки" value={formData.constructionYear} onChange={handleChange} required />
                <input type="number" name="rating" placeholder="Рейтинг" value={formData.rating} onChange={handleChange} required />
                <input type="number" name="managerId" placeholder="ID менеджера" value={formData.managerId} onChange={handleChange} required />
                <input type="number" name="hotelTypeId" placeholder="ID типа отеля" value={formData.hotelTypeId} onChange={handleChange} required />
                <button type="submit">Добавить</button>
            </form>
        </div>
    );
};

export default AddHotel;
