import React, { useEffect, useState } from 'react';
import styles from './Administrators.module.css';

interface Role {
  name: string;
  displayName: string;
}

interface Admin {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  roles: Role[];
  createdAt: string;
}

export const Administrators: React.FC = () => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const API_URL = (import.meta as any).env.VITE_API_URL as string;
      const token = localStorage.getItem('hotel_token');
      
      if (!token) {
        throw new Error('No authentication token found. Please log in again.');
      }
      
      const response = await fetch(`${API_URL}/admin/users/admins`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      if (!response.ok || !data.ok) {
        throw new Error(data.error || 'Failed to fetch administrators');
      }

      setAdmins(data.data.admins);
    } catch (err: any) {
      console.error('Error fetching admins:', err);
      setError(err.message || 'Failed to load administrators');
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivate = async (adminId: string) => {
    if (!confirm('Are you sure you want to deactivate this administrator?')) return;
    
    try {
      const API_URL = (import.meta as any).env.VITE_API_URL as string;
      const token = localStorage.getItem('hotel_token');
      
      if (!token) {
        throw new Error('No authentication token found. Please log in again.');
      }
      
      const response = await fetch(`${API_URL}/admin/users/${adminId}/deactivate`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      if (!response.ok || !data.ok) {
        throw new Error(data.error || 'Failed to deactivate administrator');
      }

      // Refresh the list
      fetchAdmins();
    } catch (err: any) {
      console.error('Error deactivating admin:', err);
      alert(err.message || 'Failed to deactivate administrator');
    }
  };

  const handleActivate = async (adminId: string) => {
    if (!confirm('Are you sure you want to activate this administrator?')) return;
    
    try {
      const API_URL = (import.meta as any).env.VITE_API_URL as string;
      const token = localStorage.getItem('hotel_token');
      
      if (!token) {
        throw new Error('No authentication token found. Please log in again.');
      }
      
      const response = await fetch(`${API_URL}/admin/users/${adminId}/activate`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      if (!response.ok || !data.ok) {
        throw new Error(data.error || 'Failed to activate administrator');
      }

      // Refresh the list
      fetchAdmins();
    } catch (err: any) {
      console.error('Error activating admin:', err);
      alert(err.message || 'Failed to activate administrator');
    }
  };

  const getRoleBadgeClass = (roleName: string): string => {
    switch(roleName) {
      case 'super_admin':
        return styles.superAdmin;
      case 'hotel_manager':
        return styles.admin;
      case 'support_agent':
        return styles.moderator;
      default:
        return styles.admin;
    }
  };

  const getDisplayRole = (roles: Role[]): Role | null => {
    // Priority: super_admin > hotel_manager > support_agent
    const priority = ['super_admin', 'hotel_manager', 'support_agent'];
    for (const roleName of priority) {
      const role = roles.find(r => r.name === roleName);
      if (role) return role;
    }
    return roles[0] || null;
  };

  const activeAdmins = admins.filter(a => a.isActive);
  const inactiveAdmins = admins.filter(a => !a.isActive);

  return (
    <div className={styles.container}>
      <div className={styles.headerBar}>
        <h1 className={styles.title}>Administrators</h1>
        <button className={styles.addButton}>+ Add New</button>
      </div>

      {loading && (
        <div style={{ padding: '2rem', textAlign: 'center' }}>Loading administrators...</div>
      )}

      {error && (
        <div style={{ padding: '1rem', color: '#b00020', background: '#ffebee', borderRadius: '8px', margin: '1rem 0' }}>
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          {/* Active Administrators */}
          <section className={styles.adminSection}>
            <h3 className={styles.subtitle}>Active Administrators ({activeAdmins.length})</h3>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Admin ID</th>
                  <th>Admin Name</th>
                  <th>Email</th>
                  <th>Admin Type</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {activeAdmins.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                      No active administrators found
                    </td>
                  </tr>
                ) : (
                  activeAdmins.map((admin) => {
                    const displayRole = getDisplayRole(admin.roles);
                    return (
                      <tr key={admin.id}>
                        <td>#{admin.id.slice(0, 8)}</td>
                        <td>{admin.firstName} {admin.lastName}</td>
                        <td>{admin.email}</td>
                        <td>
                          {displayRole && (
                            <span className={`${styles.typeBadge} ${getRoleBadgeClass(displayRole.name)}`}>
                              {displayRole.displayName}
                            </span>
                          )}
                        </td>
                        <td>
                          <button className={styles.editBtn}>Edit</button>
                          <button 
                            className={styles.deactivateBtn}
                            onClick={() => handleDeactivate(admin.id)}
                          >
                            Deactivate
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </section>

          {/* Inactive Administrators */}
          {inactiveAdmins.length > 0 && (
            <section className={styles.adminSection}>
              <h3 className={styles.subtitle}>Inactive Administrators ({inactiveAdmins.length})</h3>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Admin ID</th>
                    <th>Admin Name</th>
                    <th>Email</th>
                    <th>Admin Type</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {inactiveAdmins.map((admin) => {
                    const displayRole = getDisplayRole(admin.roles);
                    return (
                      <tr key={admin.id}>
                        <td>#{admin.id.slice(0, 8)}</td>
                        <td>{admin.firstName} {admin.lastName}</td>
                        <td>{admin.email}</td>
                        <td>
                          {displayRole && (
                            <span className={`${styles.typeBadge} ${getRoleBadgeClass(displayRole.name)}`}>
                              {displayRole.displayName}
                            </span>
                          )}
                        </td>
                        <td>
                          <button 
                            className={styles.approveBtn}
                            onClick={() => handleActivate(admin.id)}
                          >
                            Activate
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </section>
          )}
        </>
      )}
    </div>
  );
};