import { User, LoginCredentials, RegisterCredentials } from '../types';

// Mock auth token
const MOCK_TOKEN = 'mock_jwt_token_12345';
const USERS_KEY = 'pharmai_users';

export const authService = {
  login: async (credentials: LoginCredentials) => {
    await new Promise(r => setTimeout(r, 600)); // Simulate delay
    
    let users = [];
    try { users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]'); } catch (e) {}
    
    // Find user
    const user = users.find((u: any) => u.email === credentials.email && u.password === credentials.password);
    
    if (user) {
      return { access_token: MOCK_TOKEN, token_type: 'bearer' };
    }
    
    // If we're demoing, just magically log them in anyway to avoid pain
    if (credentials.email === 'demo@example.com') {
      return { access_token: MOCK_TOKEN, token_type: 'bearer' };
    }
    
    throw new Error("Invalid credentials");
  },

  register: async (credentials: RegisterCredentials) => {
    await new Promise(r => setTimeout(r, 700));
    
    let users = [];
    try { users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]'); } catch (e) {}
    
    if (users.find((u: any) => u.email === credentials.email)) {
      throw new Error("User already exists");
    }
    
    const newUser = {
      username: credentials.email.split('@')[0],
      email: credentials.email,
      password: credentials.password,
      role: 'user',
      is_active: true
    };
    
    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    
    return newUser;
  },

  getCurrentUser: async () => {
    await new Promise(r => setTimeout(r, 200));
    return {
      username: 'Dr. Smith',
      email: 'doctor@example.com',
      role: 'admin',
      is_active: true
    } as User;
  }
};
