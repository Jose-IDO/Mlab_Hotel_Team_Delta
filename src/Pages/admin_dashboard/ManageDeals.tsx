import React, { useState, useEffect } from "react";
import styles from "./ManageDeals.module.css";
import { ConfirmDialog } from "../../Components/Shared/ConfirmDialog";

interface Deal {
  id: number;
  roomId: string;
  roomName: string;
  roomType: string;
  title: string;
  description?: string;
  discountPercentage: number;
  originalPrice: number;
  discountedPrice: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: string;
}

interface Room {
  id: string;
  roomName: string;
  roomType: string;
  price: number;
}

export const ManageDeals: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingDealId, setEditingDealId] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    roomId: "",
    title: "",
    description: "",
    discountPercentage: "",
    startDate: "",
    endDate: ""
  });
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchDeals();
    fetchRooms();
  }, []);

  const fetchDeals = async () => {
    try {
      const token = localStorage.getItem('hotel_token');
      const res = await fetch(`${API_URL}/admin/deals`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.ok) {
        setDeals(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch deals:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRooms = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/rooms?status=active`);
      const data = await res.json();
      if (data.ok) {
        setRooms(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch rooms:', err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.roomId || !formData.title || !formData.discountPercentage || !formData.startDate || !formData.endDate) {
      setErrorMessage('Please fill in all required fields');
      setTimeout(() => setErrorMessage(null), 5000);
      return;
    }

    const discount = parseInt(formData.discountPercentage);
    if (isNaN(discount) || discount < 1 || discount > 100) {
      setErrorMessage('Discount percentage must be between 1 and 100');
      setTimeout(() => setErrorMessage(null), 5000);
      return;
    }

    try {
      const token = localStorage.getItem('hotel_token');
      const url = editingDealId 
        ? `${API_URL}/admin/deals/${editingDealId}` 
        : `${API_URL}/admin/deals`;
      
      const method = editingDealId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          roomId: formData.roomId,
          title: formData.title,
          description: formData.description || undefined,
          discountPercentage: discount,
          startDate: formData.startDate,
          endDate: formData.endDate
        })
      });

      const data = await res.json();
      
      if (data.ok) {
        setSuccessMessage(editingDealId ? 'Deal updated successfully!' : 'Deal created successfully!');
        setTimeout(() => setSuccessMessage(null), 3000);
        setShowForm(false);
        setEditingDealId(null);
        setFormData({
          roomId: "",
          title: "",
          description: "",
          discountPercentage: "",
          startDate: "",
          endDate: ""
        });
        fetchDeals();
      } else {
        setErrorMessage(`Error: ${data.error}`);
        setTimeout(() => setErrorMessage(null), 5000);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to save deal');
      setTimeout(() => setErrorMessage(null), 5000);
    }
  };

  const handleEdit = (deal: Deal) => {
    setEditingDealId(deal.id);
    setFormData({
      roomId: deal.roomId,
      title: deal.title,
      description: deal.description || "",
      discountPercentage: deal.discountPercentage.toString(),
      startDate: new Date(deal.startDate).toISOString().slice(0, 16),
      endDate: new Date(deal.endDate).toISOString().slice(0, 16)
    });
    setShowForm(true);
  };

  const handleToggleActive = async (id: number) => {
    try {
      const token = localStorage.getItem('hotel_token');
      const res = await fetch(`${API_URL}/admin/deals/${id}/toggle`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await res.json();
      if (data.ok) {
        fetchDeals();
      }
    } catch (err) {
      console.error('Failed to toggle deal status:', err);
    }
  };

  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    variant: 'danger' | 'warning' | 'info';
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    variant: 'warning'
  });

  const handleDelete = (id: number) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Deal',
      message: 'Are you sure you want to delete this deal? This action cannot be undone.',
      variant: 'danger',
      onConfirm: async () => {
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
        try {
          const token = localStorage.getItem('hotel_token');
          const res = await fetch(`${API_URL}/admin/deals/${id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          const data = await res.json();
          if (data.ok) {
            setSuccessMessage('Deal deleted successfully!');
            setTimeout(() => setSuccessMessage(null), 3000);
            fetchDeals();
          }
        } catch (err: any) {
          setErrorMessage(err.message || 'Failed to delete deal');
          setTimeout(() => setErrorMessage(null), 5000);
        }
      }
    });
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingDealId(null);
    setFormData({
      roomId: "",
      title: "",
      description: "",
      discountPercentage: "",
      startDate: "",
      endDate: ""
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isActive = (deal: Deal) => {
    const now = new Date();
    const start = new Date(deal.startDate);
    const end = new Date(deal.endDate);
    return deal.isActive && now >= start && now <= end;
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.headerBar}>
          <h1 className={styles.title}>Loading deals...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {successMessage && <div className={styles.successAlert}>✓ {successMessage}</div>}
      {errorMessage && <div className={styles.errorAlert}>⚠️ {errorMessage}</div>}
      
      <div className={styles.headerBar}>
        <h1 className={styles.title}>Manage Deals & Discounts</h1>
        <button 
          className={styles.addButton}
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : '+ Add New Deal'}
        </button>
      </div>

      {showForm && (
        <div className={styles.overlay} onClick={handleCancel}>
          <div className={styles.formContainer} onClick={(e) => e.stopPropagation()}>
          <div className={styles.formHeader}>
            <h2 className={styles.formTitle}>
            {editingDealId ? 'Edit Deal' : 'Create New Deal'}
          </h2>
            <button className={styles.closeFormBtn} onClick={handleCancel}>×</button>
          </div>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Room *</label>
                <select
                  name="roomId"
                  value={formData.roomId}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select a room</option>
                  {rooms.map(room => (
                    <option key={room.id} value={room.id}>
                      {room.roomName} - {room.roomType} (R{room.price})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Deal Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Weekend Special"
                  required
                />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Optional description of the deal"
                  rows={3}
                />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Discount Percentage * (1-100)</label>
                <input
                  type="number"
                  name="discountPercentage"
                  value={formData.discountPercentage}
                  onChange={handleInputChange}
                  min="1"
                  max="100"
                  placeholder="e.g., 25"
                  required
                />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Start Date & Time *</label>
                <input
                  type="datetime-local"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>End Date & Time *</label>
                <input
                  type="datetime-local"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className={styles.formActions}>
              <button type="submit" className={styles.submitBtn}>
                {editingDealId ? 'Update Deal' : 'Create Deal'}
              </button>
              <button 
                type="button" 
                className={styles.cancelBtn}
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          </form>
          </div>
        </div>
      )}

      <section className={styles.section}>
        <h3 className={styles.subtitle}>All Deals ({deals.length})</h3>
        {deals.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
            No deals created yet. Create your first deal to get started!
          </p>
        ) : (
          <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Title</th>
                <th>Room</th>
                <th>Discount</th>
                <th>Original Price</th>
                <th>Deal Price</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {deals.map(deal => (
                <tr key={deal.id} style={{ opacity: !deal.isActive ? 0.6 : 1 }}>
                  <td>
                    <strong>{deal.title}</strong>
                    {deal.description && (
                      <div style={{ fontSize: '0.85em', color: '#666', marginTop: '4px' }}>
                        {deal.description}
                      </div>
                    )}
                  </td>
                  <td>
                    <div>{deal.roomName}</div>
                    <div style={{ fontSize: '0.85em', color: '#666' }}>{deal.roomType}</div>
                  </td>
                  <td>
                    <span className={styles.discountBadge}>{deal.discountPercentage}% OFF</span>
                  </td>
                  <td>R{deal.originalPrice.toFixed(2)}</td>
                  <td className={styles.dealPrice}>R{deal.discountedPrice.toFixed(2)}</td>
                  <td>{formatDate(deal.startDate)}</td>
                  <td>{formatDate(deal.endDate)}</td>
                  <td>
                    {isActive(deal) ? (
                      <span className={styles.statusActive}>● Active</span>
                    ) : deal.isActive ? (
                      <span className={styles.statusScheduled}>● Scheduled</span>
                    ) : (
                      <span className={styles.statusInactive}>● Inactive</span>
                    )}
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <button 
                        className={styles.editBtn}
                        onClick={() => handleEdit(deal)}
                        title="Edit"
                      >
                        Edit
                      </button>
                      <button
                        className={deal.isActive ? styles.archiveBtn : styles.restoreBtn}
                        onClick={() => handleToggleActive(deal.id)}
                        title={deal.isActive ? 'Deactivate' : 'Activate'}
                      >
                        {deal.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button 
                        className={styles.deleteBtn}
                        onClick={() => handleDelete(deal.id)}
                        title="Delete"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        )}
      </section>

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        variant={confirmDialog.variant}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
};
