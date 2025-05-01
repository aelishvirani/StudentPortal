import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import axios to make HTTP requests
import HomeHelper from "../../Components/HomeHelper"
const StudentAnnouncements = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const token = localStorage.getItem('jwtToken');
                if (!token) {
                    alert("You are not logged in. Please log in again.");
                    return;
                }

                const response = await axios.get('http://localhost:5000/api/faculty/get-announcements', {
                    headers: {
                        'Authorization': `Bearer ${token}`,  // Include the JWT token in the request header
                    }
                });

                setAnnouncements(response.data.announcements);  // Set announcements data
                setIsLoading(false);  // Stop loading after data is fetched
            } catch (err) {
                setError('Error fetching announcements');
                setIsLoading(false);
                console.error(err);
            }
        };

        fetchAnnouncements();
    }, []);

    return (
        <div>
            <HomeHelper />
            <h2 className="text-center mb-4">All Announcements</h2>

            {isLoading && <div className="spinner-border text-primary middle" role="status"><span className="sr-only">Loading...</span></div>}
            {error && <div className="alert alert-danger">{error}</div>}
            {!isLoading && !error && announcements.length === 0 && <div className="text-center">No announcements available at the moment.</div>}

            <div>
                {announcements.map((announcement) => (
                    <div key={announcement._id} className="card mb-4">
                        <div className="card-body">
                            <h5 className="card-title">{announcement.title}</h5>
                            <p className="card-text">{announcement.content}</p>
                            <div className="card-footer text-muted">
                                Department: {announcement.department} | Faculty: {announcement.facultyId.name}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StudentAnnouncements;
