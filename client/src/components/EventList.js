import React, { useEffect, useState } from 'react';
import './EventList.css';

function EventList() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/events')
      .then((res) => res.json())
      .then((data) => setEvents(data))
      .catch((err) => console.error('Error fetching events:', err));
  }, []);

  return (
    <div>
      <h2>All Events</h2>
      {events.length === 0 ? (
        <p>No events found.</p>
      ) : (
        <ul>
          {events.map((event) => (
            <li key={event.id}>
              <h3>{event.title}</h3>
              <p>{event.description}</p>
              <p>
                <strong>Date:</strong>{' '}
                {new Date(event.start_time).toLocaleString()} -{' '}
                {new Date(event.end_time).toLocaleString()}
              </p>
              <p>
                <strong>Location:</strong> {event.location}
              </p>
              <p>
                <strong>Host:</strong> {event.host}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default EventList;
