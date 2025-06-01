import React, { useState } from "react";
import "../styles/ImageGallery.css";

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
        <div className="custom-gallery">
            {images.length > 0 && (
                <div className="main-image" onClick={() => openModal(0)}>
                    <img
                        src={`http://localhost:8080${images[0].imageUrl}`}
                        alt="Main"
                    />
                </div>
            )}

            <div className="side-thumbnails">
                {images.slice(1, 4).map((img, i) => (
                    <div key={i + 1} className="side-thumb" onClick={() => openModal(i + 1)}>
                        <img src={`http://localhost:8080${img.imageUrl}`} alt={`thumb-${i + 1}`} />
                    </div>
                ))}

                {images.length > 4 && (
                    <div className="side-thumb more-images" onClick={() => openModal(4)}>
                        <img src={`http://localhost:8080${images[4].imageUrl}`} alt="more" />
                        <div className="overlay">+{images.length - 4}</div>
                    </div>
                )}
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
