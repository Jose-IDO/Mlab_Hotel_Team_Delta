export const seedAdminUser = () => {
  const users = JSON.parse(localStorage.getItem('hotel_users') || '[]');
  
  const adminExists = users.find((u: any) => u.role === 'admin');
  const customerExists = users.find((u: any) => u.email === 'customer@deltahotel.com');
  
  if (!adminExists) {
    const adminUser = {
      id: 'admin-001',
      email: 'admin@deltahotel.com',
      password: 'admin123',
      name: 'Hotel Administrator',
      role: 'admin'
    };
    
    users.push(adminUser);
    console.log('Admin user created: admin@deltahotel.com / admin123');
  }

  if (!customerExists) {
    const customerUser = {
      id: 'customer-001',
      email: 'customer@deltahotel.com',
      password: 'customer123',
      name: 'Test Customer',
      role: 'customer'
    };
    
    users.push(customerUser);
    console.log('Customer user created: customer@deltahotel.com / customer123');
  }
  
  localStorage.setItem('hotel_users', JSON.stringify(users));
};
