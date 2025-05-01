import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, withRouter } from 'react-router-dom';
import axios from 'axios'; // Make sure axios is imported
import { facultyAddAnnouncement } from '../../redux/action/facultyAction';
import FacultyHomeHelper from '../../Components/FacultyHomeHelper';

const FacultyAddAnnouncement = () => {
    const store = useSelector((store) => store);
    const dispatch = useDispatch();
    const history = useHistory();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [department, setDepartment] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const formHandler = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = {
            title,
            content,
            department,
            facultyId: store.faculty.faculty._id, // Use correct faculty ID from Redux store
        };

        const token = localStorage.getItem('jwtToken'); // Retrieve the JWT token

        if (!token) {
            alert("You are not logged in, please log in again.");
            history.push('/login'); // Redirect to login page
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/api/faculty/add-announcement', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            dispatch({
                type: 'ADD_ANNOUNCEMENT_SUCCESS',
                payload: response.data,
            });

            history.push('/faculty-home'); // Redirect to faculty home page after success
        } catch (error) {
            console.error('Error adding announcement:', error.response || error.message);

            if (error.response && error.response.status === 401) {
                alert('Session expired or unauthorized. Please log in again.');
                history.push('/login'); // Redirect to login page
            } else {
                dispatch({
                    type: 'ADD_ANNOUNCEMENT_FAILURE',
                    payload: error.response ? error.response.data.message : 'Error occurred',
                });
            }
        }
    };


    useEffect(() => {
        // Once announcement is added successfully, stop the loading spinner
        if (store.faculty.addAnnouncementFlag) {
            setIsLoading(false);
        }
    }, [store.faculty.addAnnouncementFlag]);

    return (
        <div>
            {store.faculty.isAuthenticated ? (
                <>
                    <FacultyHomeHelper />
                    <div className="container mt-5">
                        <div className="row">
                            <div className="col-md-6 w-100 m-auto">
                                <form onSubmit={formHandler}>
                                    <div className="form-group">
                                        <label htmlFor="titleId">Title</label>
                                        <input
                                            required
                                            type="text"
                                            className="form-control"
                                            id="titleId"
                                            placeholder="Enter Announcement Title"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="contentId">Content</label>
                                        <textarea
                                            required
                                            className="form-control"
                                            id="contentId"
                                            rows="4"
                                            placeholder="Enter Announcement Content"
                                            value={content}
                                            onChange={(e) => setContent(e.target.value)}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="departmentId">Department</label>
                                        <input
                                            required
                                            type="text"
                                            className="form-control"
                                            id="departmentId"
                                            placeholder="Enter Department"
                                            value={department}
                                            onChange={(e) => setDepartment(e.target.value)}
                                        />
                                    </div>

                                    <div className="row justify-content-center">
                                        <div className="col-md-1">
                                            {isLoading && <div className="spinner-border text-primary" role="status">
                                                <span className="sr-only">Loading...</span>
                                            </div>}
                                        </div>
                                    </div>

                                    {!isLoading && <button type="submit" className="btn btn-info">Add Announcement</button>}
                                </form>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                history.push('/') // Redirect to login if not authenticated
            )}
        </div>
    );
};

export default withRouter(FacultyAddAnnouncement);
