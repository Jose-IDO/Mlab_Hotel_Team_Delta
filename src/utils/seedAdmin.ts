export const seedAdminUser = () => {
  const users = JSON.parse(localStorage.getItem('hotel_users') || '[]');
  
  const adminExists = users.find((u: any) => u.role === 'admin');
  
  if (!adminExists) {
    const adminUser = {
      id: 'admin-001',
      email: 'admin@deltahotel.com',
      password: 'admin123',
      name: 'Hotel Administrator',
      role: 'admin'
    };
    
    users.push(adminUser);
    localStorage.setItem('hotel_users', JSON.stringify(users));
    console.log('Admin user created: admin@deltahotel.com / admin123');
  }
};
