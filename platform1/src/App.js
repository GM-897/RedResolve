import { useState, useEffect, useCallback } from 'react';
import io from 'socket.io-client';
import './App.css';
import Header from './components/Header';
import ComplaintsList from './components/ComplaintsList';
import AddComplaintButton from './components/AddComplaintButton';
import ComplaintModal from './components/ComplaintModal';

// 1. Connect to backend via Socket.IO
// const socket = io('http://localhost:4000');

const socket = io('https://red-resolve-backend.vercel.app');

function App() {
  const [complaints, setComplaints] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 2. Initial fetch for already existing tickets
  const fetchComplaints = useCallback(async () => {
    try {
      // const res = await fetch('http://localhost:4000/api/v1/tickets/getAllTicketsUser');

    const res = await fetch('https://red-resolve-backend.vercel.app/api/v1/tickets/getAllTicketsUser');

      const data = await res.json();

      if (data.success) {
        setComplaints(data.tickets);
      } else {
        console.error('Failed to fetch complaints:', data.message);
      }
    } catch (error) {
      console.error('Error fetching complaints:', error);
    }
  }, []);

  useEffect(() => {
    fetchComplaints();

    // 3. Listen for new tickets from backend
    socket.on('newTicket', (newTicket) => {
      if (newTicket.status === 'Open' || newTicket.status === 'Pending') {
        setComplaints(prev => [newTicket, ...prev]);
      }
    });

    // 4. Listen for ticket updates (resolved, not resolved, etc.)
    socket.on('ticketUpdated', (updatedTicket) => {
      setComplaints(prevComplaints => {
        if (updatedTicket.status === 'Resolved' || updatedTicket.status === 'Not Resolved') {
          return prevComplaints.filter(c => c._id !== updatedTicket._id);
        }
        return prevComplaints.map(c =>
          c._id === updatedTicket._id ? updatedTicket : c
        );
      });
    });

    // 5. Cleanup socket listeners
    return () => {
      socket.off('newTicket');
      socket.off('ticketUpdated');
    };
  }, [fetchComplaints]);

  // Modal controls
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="App">
      <Header />
      <AddComplaintButton onButtonClick={openModal} />
      <ComplaintsList complaints={complaints} refreshComplaints={fetchComplaints} />
      <ComplaintModal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
      />
    </div>
  );
}

export default App;
