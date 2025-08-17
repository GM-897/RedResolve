
import React from 'react';
import './IssueItem.css';

const IssueItem = ({ issue, onStatusChange }) => {
    const handleResolvedClick = async () => {
        if (issue.status === 'Pending') return;

        const confirmed = window.confirm('Are you sure you want to mark this issue as pending review?');
        if (!confirmed) return;

        try {
            const res = await fetch(`http://localhost:4000/api/tickets/${issue._id}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'Pending' })
            });

            if (!res.ok) {
                throw new Error('Failed to update ticket status');
            }

            const updatedTicket = await res.json();

            if (onStatusChange) {
                onStatusChange(updatedTicket);
            }
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Error updating status');
        }
    };

    return (
        <div className="issue-item-card">
            <div className="card-header">
                <div className="header-content">
                    <h3>Room: {issue.room}</h3>
                </div>

                <span className={`status-badge ${issue.status.toLowerCase().replace(/_/g, '-')}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="icon" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    {issue.status}
                </span>
            </div>

            {issue.imageUrl && (
                <div className="issue-image-container">
                    <img src={issue.imageUrl} alt="Issue" className="issue-image" />
                </div>
            )}

            <div className="card-body">
                <p className="issue-description">{issue.description}</p>
                <div className="issue-details">
                    <div className="detail-item">
                        <svg xmlns="http://www.w3.org/2000/svg" className="icon" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zm-1.5 5a.5.5 0 01.5-.5h2a.5.5 0 01.5.5v2a.5.5 0 01-.5.5h-2a.5.5 0 01-.5-.5v-2zM10 13a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                        </svg>
                        <strong>Category:</strong> {issue.category}
                    </div>
                    <div className="detail-item">
                        <svg xmlns="http://www.w3.org/2000/svg" className="icon" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                        <strong>Reported At:</strong> {new Date(issue.createdAt).toLocaleString()}
                    </div>
                </div>
            </div>

            <div className="card-footer">
                <button
                    onClick={handleResolvedClick}
                    className="resolve-btn"
                    disabled={issue.status === 'Pending'}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="icon" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Resolved
                </button>
            </div>
        </div>
    );
};

export default IssueItem;
