import React, { useState, useRef } from 'react';
import Modal from 'react-modal';
import { Upload, X, CheckCircle } from 'lucide-react';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    maxWidth: '700px',
    padding: '0',
    borderRadius: '20px',
    maxHeight: '90vh',
    overflowY: 'auto',
    border: 'none',
    background: 'linear-gradient(135deg, #ffffff 0%, #fafafa 100%)',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    zIndex: 50,
    backdropFilter: 'blur(4px)',
  }
};

const ComplaintModal = ({ isOpen, onRequestClose }) => {
  const [formData, setFormData] = useState({
    category: '',
    description: '',
    room: '',
    files: [],
  });
  
  const [loading, setLoading] = useState(false);
  const [ticketGenerated, setTicketGenerated] = useState(false);
  const [generatedTicket, setGeneratedTicket] = useState(null);
  const fileInputRef = useRef(null);

  const issueCategories = [
    'Room Issue',
    'Front Desk Services',
    'Amenities',
    'Safety And Security',
    'Other'
  ];

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    if (formData.files.length + files.length > 1) {
      alert('Only 1 file is allowed');
      return;
    }
    setFormData((prev) => ({ ...prev, files: [...prev.files, ...files] }));
  };

  const removeFile = (index) => {
    setFormData((prev) => ({ ...prev, files: prev.files.filter((_, i) => i !== index) }));
  };

  const handleSubmit = async () => {
    if (!formData.category || !formData.description || !formData.room) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      const form = new FormData();
      form.append('category', formData.category);
      form.append('description', formData.description);
      form.append('room', formData.room);

      if (formData.files.length > 0) {
        form.append('image', formData.files[0]);
      }

      const response = await fetch('http://localhost:4000/api/v1/tickets/submit', {
        method: 'POST',
        body: form,
      });

      if (!response.ok) throw new Error('Failed to submit complaint');

      const result = await response.json();

      setGeneratedTicket({
        ticketId: result.ticket?._id,
        ...formData,
        timestamp: new Date().toISOString(),
      });

      setTicketGenerated(true);
    } catch (error) {
      console.error('Error submitting complaint:', error);
      alert('Error submitting complaint');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      category: '',
      description: '',
      room: '',
      files: []
    });
    setTicketGenerated(false);
    setGeneratedTicket(null);
  };

  const modalHeaderStyle = {
    background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
    color: 'white',
    padding: '1.5rem 2rem',
    borderRadius: '20px 20px 0 0',
    marginBottom: '2rem',
    position: 'relative',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  };

  const closeButtonStyle = {
    position: 'absolute',
    top: '50%',
    right: '1.5rem',
    transform: 'translateY(-50%)',
    background: 'rgba(255, 255, 255, 0.2)',
    border: 'none',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: 'white',
    fontSize: '24px',
    fontWeight: 'bold',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    backdropFilter: 'blur(10px)',
  };

  const categoryButtonStyle = (isSelected) => ({
    padding: '12px 16px',
    borderRadius: '12px',
    fontSize: '0.9rem',
    fontWeight: '600',
    border: isSelected ? '2px solid #dc2626' : '2px solid #e5e7eb',
    background: isSelected 
      ? 'linear-gradient(135deg, #fee2e2, #fecaca)' 
      : 'linear-gradient(135deg, #f8fafc, #ffffff)',
    color: isSelected ? '#b91c1c' : '#374151',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    overflow: 'hidden',
    textAlign: 'center',
    boxShadow: isSelected 
      ? '0 4px 8px rgba(220, 38, 38, 0.2)' 
      : '0 2px 4px rgba(0, 0, 0, 0.1)',
  });

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '12px',
    border: '2px solid #e5e7eb',
    fontSize: '0.95rem',
    background: 'linear-gradient(135deg, #f9fafb, #ffffff)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    fontFamily: 'inherit',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
  };

  const submitButtonStyle = {
    background: loading 
      ? 'linear-gradient(135deg, #9ca3af, #6b7280)' 
      : 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
    color: 'white',
    padding: '14px 24px',
    borderRadius: '12px',
    fontSize: '1.1rem',
    fontWeight: '700',
    border: 'none',
    cursor: loading ? 'not-allowed' : 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    width: '100%',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    boxShadow: loading 
      ? 'none' 
      : '0 8px 16px rgba(220, 38, 38, 0.3)',
    position: 'relative',
    overflow: 'hidden',
  };

  const fileUploadStyle = {
    padding: '2rem',
    border: '2px dashed #dc2626',
    borderRadius: '12px',
    textAlign: 'center',
    background: 'linear-gradient(135deg, #fee2e2, #ffffff)',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    overflow: 'hidden',
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={customStyles}
      contentLabel="Add Complaint Modal"
      appElement={document.getElementById('root')}
    >
      <div style={{ padding: '0', margin: '0' }}>
        {/* Enhanced Header */}
        <div style={modalHeaderStyle}>
          <h2 style={{ 
            fontSize: '1.6rem', 
            fontWeight: '700', 
            margin: '0', 
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            📝 File a New Complaint
          </h2>
          <button
            onClick={onRequestClose}
            style={closeButtonStyle}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.3)';
              e.target.style.transform = 'translateY(-50%) scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.2)';
              e.target.style.transform = 'translateY(-50%) scale(1)';
            }}
          >
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: '0 2rem 2rem' }}>
          {/* Conditional: Form vs Success Message */}
          {!ticketGenerated ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Category */}
              <div>
                <h3 style={{ 
                  fontSize: '1.1rem', 
                  fontWeight: '600', 
                  marginBottom: '0.75rem', 
                  color: '#1f2937',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  🏷️ Category <span style={{ color: '#dc2626' }}>*</span>
                </h3>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', 
                  gap: '0.75rem' 
                }}>
                  {issueCategories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setFormData((prev) => ({ ...prev, category: cat }))}
                      style={categoryButtonStyle(formData.category === cat)}
                      onMouseEnter={(e) => {
                        if (formData.category !== cat) {
                          e.target.style.background = 'linear-gradient(135deg, #f1f5f9, #e2e8f0)';
                          e.target.style.transform = 'translateY(-2px)';
                          e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (formData.category !== cat) {
                          e.target.style.background = 'linear-gradient(135deg, #f8fafc, #ffffff)';
                          e.target.style.transform = 'translateY(0)';
                          e.target.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
                        }
                      }}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 style={{ 
                  fontSize: '1.1rem', 
                  fontWeight: '600', 
                  marginBottom: '0.75rem', 
                  color: '#1f2937',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  📝 Description <span style={{ color: '#dc2626' }}>*</span>
                </h3>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, description: e.target.value }))
                  }
                  placeholder="Describe the issue in detail..."
                  rows="4"
                  style={{
                    ...inputStyle,
                    resize: 'vertical',
                    minHeight: '100px',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#dc2626';
                    e.target.style.background = '#ffffff';
                    e.target.style.boxShadow = '0 4px 8px rgba(220, 38, 38, 0.15)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.background = 'linear-gradient(135deg, #f9fafb, #ffffff)';
                    e.target.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.05)';
                  }}
                />
              </div>

              {/* Room Number */}
              <div>
                <h3 style={{ 
                  fontSize: '1.1rem', 
                  fontWeight: '600', 
                  marginBottom: '0.75rem', 
                  color: '#1f2937',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  🏠 Room Number <span style={{ color: '#dc2626' }}>*</span>
                </h3>
                <input
                  value={formData.room}
                  onChange={(e) => setFormData((prev) => ({ ...prev, room: e.target.value }))}
                  placeholder="e.g., 205"
                  style={inputStyle}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#dc2626';
                    e.target.style.background = '#ffffff';
                    e.target.style.boxShadow = '0 4px 8px rgba(220, 38, 38, 0.15)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.background = 'linear-gradient(135deg, #f9fafb, #ffffff)';
                    e.target.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.05)';
                  }}
                />
              </div>

              {/* File Upload */}
              <div>
                <h3 style={{ 
                  fontSize: '1.1rem', 
                  fontWeight: '600', 
                  marginBottom: '0.75rem', 
                  color: '#1f2937',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  📷 Add Photo <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>(optional)</span>
                </h3>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  style={fileUploadStyle}
                  onMouseEnter={(e) => {
                    e.target.style.borderColor = '#b91c1c';
                    e.target.style.background = 'linear-gradient(135deg, #ffffff, #fee2e2)';
                    e.target.style.transform = 'scale(1.02)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.borderColor = '#dc2626';
                    e.target.style.background = 'linear-gradient(135deg, #fee2e2, #ffffff)';
                    e.target.style.transform = 'scale(1)';
                  }}
                >
                  <Upload style={{ 
                    margin: '0 auto 8px', 
                    width: '32px', 
                    height: '32px', 
                    color: '#dc2626' 
                  }} />
                  <p style={{ 
                    fontSize: '0.95rem', 
                    color: '#6b7280',
                    margin: '0',
                    fontWeight: '500'
                  }}>
                    Click to upload (max 1 file)
                  </p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />
                {formData.files.length > 0 && (
                  <div style={{ marginTop: '0.75rem' }}>
                    {formData.files.map((file, index) => (
                      <div key={index} style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        background: '#f3f4f6',
                        fontSize: '0.9rem',
                        border: '1px solid #e5e7eb'
                      }}>
                        <span style={{ color: '#374151' }}>📎 {file.name}</span>
                        <button 
                          onClick={() => removeFile(index)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#6b7280',
                            padding: '4px',
                            borderRadius: '4px',
                            transition: 'all 0.2s',
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.background = '#fee2e2';
                            e.target.style.color = '#dc2626';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.background = 'none';
                            e.target.style.color = '#6b7280';
                          }}
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={loading}
                style={submitButtonStyle}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.target.style.background = 'linear-gradient(135deg, #b91c1c 0%, #991b1b 100%)';
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 12px 24px rgba(220, 38, 38, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
                    e.target.style.background = 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)';
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 8px 16px rgba(220, 38, 38, 0.3)';
                  }
                }}
              >
                {loading ? '⏳ Submitting...' : '🚀 Submit Complaint'}
              </button>
            </div>
          ) : (
            <div style={{ 
              textAlign: 'center', 
              padding: '2rem',
              background: 'linear-gradient(135deg, #f0fdf4, #ffffff)',
              borderRadius: '12px',
              border: '2px solid #16a34a'
            }}>
              <CheckCircle style={{ 
                margin: '0 auto 16px', 
                width: '64px', 
                height: '64px', 
                color: '#16a34a' 
              }} />
              <h3 style={{ 
                margin: '16px 0',
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#15803d'
              }}>
                🎉 Complaint Submitted Successfully!
              </h3>
              <div style={{
                background: '#ffffff',
                padding: '16px',
                borderRadius: '8px',
                margin: '16px 0',
                border: '1px solid #16a34a'
              }}>
                <p style={{ 
                  margin: '8px 0',
                  fontSize: '1rem',
                  color: '#374151'
                }}>
                  Ticket ID: {' '}
                  <span style={{ 
                    fontFamily: 'monospace',
                    fontSize: '1.1rem',
                    fontWeight: '700',
                    color: '#dc2626',
                    background: '#fee2e2',
                    padding: '4px 8px',
                    borderRadius: '4px'
                  }}>
                    {generatedTicket.ticketId}
                  </span>
                </p>
              </div>
              <button
                onClick={resetForm}
                style={{
                  marginTop: '24px',
                  background: 'linear-gradient(135deg, #6b7280, #4b5563)',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: '600',
                  transition: 'all 0.3s',
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'linear-gradient(135deg, #4b5563, #374151)';
                  e.target.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'linear-gradient(135deg, #6b7280, #4b5563)';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                📝 Submit Another Complaint
              </button>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ComplaintModal;