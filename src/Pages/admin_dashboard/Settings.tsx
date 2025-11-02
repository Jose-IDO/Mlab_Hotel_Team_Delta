import React, { useState } from 'react';
import styles from './Settings.module.css';

export const Settings: React.FC = () => {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    hotelName: '',
    address: '',
    phone: '',
    email: '',
    timezone: 'UTC',
    currency: 'USD',
    dateFormat: 'YYYY-MM-DD',
    timeFormat: '24h',
    taxRate: 15,
    serviceFee: 0,
    checkInTime: '14:00',
    checkOutTime: '11:00',
    cancellationPolicy: '',
  });

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: name === 'taxRate' || name === 'serviceFee' ? Number(value) : value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      // TODO: call API to persist settings
      console.log('Saving settings:', form);
      await new Promise(r => setTimeout(r, 600));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerBar}>
        <h1 className={styles.title}>Settings</h1>
        <button className={styles.saveTopBtn} form="settingsForm" type="submit" disabled={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <form id="settingsForm" className={styles.form} onSubmit={onSubmit}>
        <section className={styles.section}>
          <h3 className={styles.subtitle}>Hotel Information</h3>
          <div className={styles.grid}>
            <div className={styles.formGroup}>
              <label>Hotel Name</label>
              <input name="hotelName" value={form.hotelName} onChange={onChange} placeholder="Your Hotel Name" />
            </div>
            <div className={styles.formGroup}>
              <label>Email</label>
              <input type="email" name="email" value={form.email} onChange={onChange} placeholder="reservations@hotel.com" />
            </div>
            <div className={styles.formGroup}>
              <label>Phone</label>
              <input name="phone" value={form.phone} onChange={onChange} placeholder="+1 555 000 0000" />
            </div>
            <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
              <label>Address</label>
              <input name="address" value={form.address} onChange={onChange} placeholder="123 Beach Ave, City, Country" />
            </div>
            <div className={styles.formGroup}>
              <label>Timezone</label>
              <select name="timezone" value={form.timezone} onChange={onChange}>
                <option value="UTC">UTC</option>
                <option value="Africa/Johannesburg">Africa/Johannesburg</option>
                <option value="Europe/London">Europe/London</option>
                <option value="America/New_York">America/New_York</option>
                <option value="Asia/Dubai">Asia/Dubai</option>
              </select>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h3 className={styles.subtitle}>Preferences</h3>
          <div className={styles.grid}>
            <div className={styles.formGroup}>
              <label>Currency</label>
              <select name="currency" value={form.currency} onChange={onChange}>
                <option value="USD">USD</option>
                <option value="ZAR">ZAR</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label>Date Format</label>
              <select name="dateFormat" value={form.dateFormat} onChange={onChange}>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label>Time Format</label>
              <select name="timeFormat" value={form.timeFormat} onChange={onChange}>
                <option value="24h">24-hour</option>
                <option value="12h">12-hour</option>
              </select>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h3 className={styles.subtitle}>Taxes & Fees</h3>
          <div className={styles.grid}>
            <div className={styles.formGroup}>
              <label>Tax Rate (%)</label>
              <input type="number" name="taxRate" min={0} step="0.01" value={form.taxRate} onChange={onChange} />
            </div>
            <div className={styles.formGroup}>
              <label>Service Fee (flat)</label>
              <input type="number" name="serviceFee" min={0} step="0.01" value={form.serviceFee} onChange={onChange} />
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h3 className={styles.subtitle}>Policies</h3>
          <div className={styles.grid}>
            <div className={styles.formGroup}>
              <label>Check-in Time</label>
              <input type="time" name="checkInTime" value={form.checkInTime} onChange={onChange} />
            </div>
            <div className={styles.formGroup}>
              <label>Check-out Time</label>
              <input type="time" name="checkOutTime" value={form.checkOutTime} onChange={onChange} />
            </div>
            <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
              <label>Cancellation Policy</label>
              <textarea name="cancellationPolicy" rows={4} value={form.cancellationPolicy} onChange={onChange} placeholder="Describe your cancellation terms..." />
            </div>
          </div>
        </section>

        <div className={styles.formActions}>
          <button className={styles.cancelBtn} type="button" onClick={() => window.history.back()}>Cancel</button>
          <button className={styles.submitBtn} type="submit" disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};