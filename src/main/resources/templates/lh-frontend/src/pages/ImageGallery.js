import React, { useState } from "react";
import "../styles/ImageGallery.css"; // стилі в окремому файлі

const ImageGallery = ({ images }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    const openModal = (index) => {
        setCurrentIndex(index);
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
    };

    const showPrev = () => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    const showNext = () => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    return (
        <div>
            <div className="gallery">
                {images.map((img, i) => (
                    <img
                        key={i}
                        src={`http://localhost:8080${img.imageUrl}`}
                        alt={`image-${i}`}
                        onClick={() => openModal(i)}
                        className="thumbnail"
                    />
                ))}
            </div>

            {isOpen && (
                <div className="modal">
                    <span className="close" onClick={closeModal}>&times;</span>
                    <button className="nav left" onClick={showPrev}>&lt;</button>
                    <img
                        src={`http://localhost:8080${images[currentIndex].imageUrl}`}
                        alt="full"
                        className="modal-image"
                    />
                    <button className="nav right" onClick={showNext}>&gt;</button>
                </div>
            )}
        </div>
    );
};

export default ImageGallery;
