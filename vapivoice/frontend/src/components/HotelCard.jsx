import React from 'react';
import './HotelCard.css';

const HotelCard = ({ hotel }) => {
  // Extract hotel data
  const name = hotel.name || 'N/A';
  const location = hotel.location || 'N/A';
  const stars = hotel.stars || 0;
  const type = hotel.type || 'Hotel';
  const reviews = hotel.reviews || 'No reviews available';
  const googleMapsUrl = hotel.google_maps_url || hotel.url || '#';
  const price = hotel.price || 'Contact for pricing';
  const image = hotel.image || 'https://via.placeholder.com/400x200?text=Hotel+Image';

  // Render star rating
  const renderStars = (count) => {
    return '⭐'.repeat(Math.min(count, 5));
  };

  return (
    <div className="hotel-card-modern">
      {/* Header: Hotel Name & Stars */}
      <div className="hotel-header">
        <div className="hotel-name-section">
          <h3 className="hotel-name">{name}</h3>
          <div className="hotel-stars">{renderStars(stars)}</div>
        </div>
        <span className="hotel-type-badge">{type}</span>
      </div>

      {/* Location Section */}
      <div className="hotel-location">
        <span className="location-icon">📍</span>
        <span className="location-text">{location}</span>
      </div>

      {/* Reviews Section */}
      <div className="hotel-reviews">
        <span className="reviews-icon">💬</span>
        <p className="reviews-text">{reviews}</p>
      </div>

      {/* Price & Actions Section */}
      <div className="hotel-footer">
        <div className="price-section">
          <div className="price-label">Starting from</div>
          <div className="price-value">{price}</div>
        </div>
        
        <a 
          href={googleMapsUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="maps-button"
        >
          View on Maps 🗺️
        </a>
      </div>
    </div>
  );
};

export default HotelCard;
