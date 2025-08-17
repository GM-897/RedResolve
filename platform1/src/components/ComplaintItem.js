import React, { useState } from "react";

const ComplaintItem = ({ complaint, index, refreshComplaints }) => {
  const [hovered, setHovered] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleRemove = async () => {
    setIsLoading(true);
    try {
      await fetch(`https://red-resolve-backend.vercel.app/api/v1/tickets/delete/${complaint._id}`, { 
        method: "DELETE" 
      });
      refreshComplaints();
    } catch (error) {
      console.error('Error removing complaint:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResolved = async () => {
    setIsLoading(true);
    try {
      await fetch(`https://red-resolve-backend.vercel.app/api/v1/tickets/changeStatusToResolved/${complaint._id}`, { 
        method: "PUT" 
      });
      refreshComplaints();
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNotResolved = async () => {
    setIsLoading(true);
    try {
      await fetch(`https://red-resolve-backend.vercel.app/api/v1/tickets/changeStatusToNotResolved/${complaint._id}`, { 
        method: "PUT" 
      });
      refreshComplaints();
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusLower = status.toLowerCase();
    let className = "status-badge ";
    
    switch (statusLower) {
      case 'pending':
        className += "status-pending";
        break;
      case 'open':
        className += "status-open";
        break;
      case 'resolved':
        className += "status-resolved";
        break;
      case 'not resolved':
        className += "status-not-resolved";
        break;
      default:
        className += "status-pending";
    }
    
    return <span className={className}>{status}</span>;
  };

  return (
    <tr className={isLoading ? 'loading' : ''}>
      <td style={{ fontWeight: '600', color: '#64748b' }}>
        #{String(index + 1).padStart(3, '0')}
      </td>
      <td>
        <span className="category-cell">
          {complaint.category}
        </span>
      </td>
      <td style={{ 
        maxWidth: '200px', 
        overflow: 'hidden', 
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        color: '#374151'
      }}>
        {complaint.description}
      </td>
      <td>
        <span className="room-cell">
          {complaint.room}
        </span>
      </td>
      <td>
        {getStatusBadge(complaint.status)}
      </td>
      <td>
        <div className="action-buttons">
          <button
            onClick={handleRemove}
            className="action-btn action-btn-remove"
            onMouseEnter={() => setHovered("remove")}
            onMouseLeave={() => setHovered(null)}
            disabled={isLoading}
          >
            {isLoading ? "..." : "Remove"}
          </button>
          {complaint.status === "Pending" && (
            <>
              <button
                onClick={handleResolved}
                className="action-btn action-btn-resolved"
                onMouseEnter={() => setHovered("resolved")}
                onMouseLeave={() => setHovered(null)}
                disabled={isLoading}
              >
                {isLoading ? "..." : "Resolved"}
              </button>
              <button
                onClick={handleNotResolved}
                className="action-btn action-btn-not-resolved"
                onMouseEnter={() => setHovered("notResolved")}
                onMouseLeave={() => setHovered(null)}
                disabled={isLoading}
              >
                {isLoading ? "..." : "Not Resolved"}
              </button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
};

export default ComplaintItem;