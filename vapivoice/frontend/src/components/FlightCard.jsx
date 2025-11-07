import React from 'react';
import './FlightCard.css';

const FlightCard = ({ flight }) => {
  // Extract flight data
  const origin = flight.origin || 'N/A';
  const destination = flight.destination || 'N/A';
  const airline = flight.airline || 'N/A';
  const flightNumber = flight.flight_number || 'N/A';
  const departureTime = flight.departure_time || 'N/A';
  const arrivalTime = flight.arrival_time || 'N/A';
  const price = typeof flight.price === 'number' ? flight.price.toLocaleString('en-IN') : flight.price || 'N/A';
  const duration = flight.duration || 'N/A';

  return (
    <div className="flight-card-modern">
      {/* Header: Route */}
      <div className="flight-header">
        <h3 className="route">{origin} → {destination}</h3>
        <span className="airline-badge">{airline}</span>
      </div>

      {/* Times Section */}
      <div className="flight-times">
        <div className="time-block">
          <div className="time-label">Departure</div>
          <div className="time-value">{departureTime}</div>
        </div>
        
        <div className="time-block">
          <div className="time-label">Arrival</div>
          <div className="time-value">{arrivalTime}</div>
        </div>
        
        <div className="time-block">
          <div className="time-label">Duration</div>
          <div className="time-value">{duration}</div>
        </div>
      </div>

      {/* Price & Book Section */}
      <div className="flight-footer">
        <div className="price-section">
          <div className="price-label">Total Price</div>
          <div className="price-value">₹{price}</div>
        </div>
        
        <button className="book-button">
          Book {flightNumber} ✈️
        </button>
      </div>
    </div>
  );
};

export default FlightCard;
