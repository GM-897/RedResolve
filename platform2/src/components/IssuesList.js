

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import IssueItem from './IssueItem';

const API_URL = 'https://red-resolve-backend.vercel.app/api/tickets';

const IssuesList = () => {
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchIssues = async () => {
            try {
                setLoading(true);
                const response = await axios.get(API_URL);
                setIssues(response.data);
                setError(null);
            } catch (err) {
                setError('Failed to fetch issues. Please try again later.');
                console.error('Fetch error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchIssues();
    }, []);

    // Update status in local state after backend update
    const handleStatusChange = (updatedTicket) => {
        setIssues(prev =>
            prev.map(issue =>
                issue._id === updatedTicket._id ? updatedTicket : issue
            )
        );
    };

    if (loading) {
        return <p className="loading-state" style={{ textAlign: 'center' }}>Loading issues...</p>;
    }

    if (error) {
        return <p className="error-state" style={{ textAlign: 'center', color: 'red', margin: '20px' }}>{error}</p>;
    }

    return (
        <div className="issues-list-container">
            {issues.length === 0 ? (
                <div className="empty-state">
                    <p>No open issues found. Everything looks good! ✨</p>
                </div>
            ) : (
                issues.map(issue => (
                    <IssueItem
                        key={issue._id}
                        issue={issue}
                        onStatusChange={handleStatusChange}
                    />
                ))
            )}
        </div>
    );
};

export default IssuesList;