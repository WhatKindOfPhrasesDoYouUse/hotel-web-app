import React, { useEffect, useState } from 'react';
import {Link, redirect} from 'react-router-dom';
import { useParams } from 'react-router-dom';

const HotelReviews = () => {
    const {id} = useParams(null); // получаю id отеля, по которому буду доставать отзывыв из API
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        fetch(`http://localhost:5246/api/HotelReview/GetHotelReviewByHotelId/${id}`) // получаю отзывыв из API
            .then(res => res.json()) // преобразую ответ в JSON (хотя зачем если он уже в JSON приходит)
            .then(data => setReviews(data)) // устанавливаю полученные данные в состояние на момент выполнения
            .catch(err => console.log(err)); // ловлю ошибку, если запрос не удался
    }, [id]) // повторно вызываю если id меняется (хотя это произойдет вряд ли)

    if (!Array.isArray(reviews)) {
        return <div>Ошибка при загрузке отзывов</div>;
        
    }

    if (!reviews) {
        return <div>Загрузка отзывов</div>
    }

    if (!reviews || reviews.length === 0) {
        return <div>Отзывов на данный отель нет</div>
    }

    return (
        <div>
            <h1>Отзывы об отеле</h1>
            {reviews.length === 0 ? (
                <p>Отзывов пока нет.</p>
            ) : (
                reviews.map((review) => (
                    <div key={review.id}>
                        {/* Отображаем имя автора отзыва */}
                        <h3>{review.userAccount.firstName} {review.userAccount.lastName}</h3>

                        {/* Отображаем сам комментарий */}
                        <p><strong>Комментарий:</strong> {review.comment}</p>

                        {/* Отображаем рейтинг */}
                        <p><strong>Оценка:</strong> {review.rating} звезд</p>

                        {/* Отображаем дату публикации */}
                        <p><strong>Дата публикации:</strong> {new Date(review.publishDate).toLocaleDateString()}</p>

                        <hr />
                    </div>
                ))
            )}
        </div>
    );
}

export default HotelReviews;