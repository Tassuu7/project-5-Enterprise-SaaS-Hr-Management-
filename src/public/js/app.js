/**
 * WorkSphere Enterprise HRMS - Core Client Application Controller
 * Layer: Frontend Client SPA & API Bridge
 */

class WorkSphereApp {
  constructor() {
    this.apiBase = '/api/v1';
    this.token = localStorage.getItem('worksphere_jwt') || null;
    this.currentUser = JSON.parse(localStorage.getItem('worksphere_user') || 'null');
    
    if (!this.currentUser) {
      this.currentUser = {
        id: 'usr_admin_01',
        firstName: 'Alexander',
        lastName: 'Sterling',
        role: 'SUPER_ADMIN',
        email: 'alexander.sterling@worksphere.corp',
        avatarUrl: 'https://ui-avatars.com/api/?name=Alexander+Sterling&background=1E3A8A&color=fff',
      };
      localStorage.setItem('worksphere_user', JSON.stringify(this.currentUser));
    }
    
    this.init();
  }

  init() {
    this.updateUserUI();
    this.setupTheme();
  }

  async request(endpoint, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const config = {
      ...options,
      headers,
    };

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    try {
      const res = await fetch(`${this.apiBase}${endpoint}`, config);
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 401) {
          this.logout();
        }
        throw new Error(data.message || 'API request failed');
      }
      return data;
    } catch (err) {
      this.showToast(err.message, 'error');
      throw err;
    }
  }

  setSession(token, user) {
    this.token = token;
    this.currentUser = user;
    localStorage.setItem('worksphere_jwt', token);
    localStorage.setItem('worksphere_user', JSON.stringify(user));
    this.updateUserUI();
  }

  logout() {
    this.token = null;
    this.currentUser = null;
    localStorage.removeItem('worksphere_jwt');
    localStorage.removeItem('worksphere_user');
    window.location.href = '/login';
  }

  updateUserUI() {
    const userNameEl = document.getElementById('current-user-name');
    const userRoleEl = document.getElementById('current-user-role');
    const userAvatarEl = document.getElementById('current-user-avatar');

    if (this.currentUser) {
      if (userNameEl) userNameEl.textContent = `${this.currentUser.firstName} ${this.currentUser.lastName}`;
      if (userRoleEl) userRoleEl.textContent = this.currentUser.role.replace('_', ' ');
      if (userAvatarEl && this.currentUser.avatarUrl) userAvatarEl.src = this.currentUser.avatarUrl;
    }
  }

  setupTheme() {
    const savedTheme = localStorage.getItem('worksphere_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
  }

  toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', current);
    localStorage.setItem('worksphere_theme', current);
  }

  showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.style.position = 'fixed';
    toast.style.bottom = '24px';
    toast.style.right = '24px';
    toast.style.background = type === 'error' ? '#e11d48' : '#4f46e5';
    toast.style.color = '#fff';
    toast.style.padding = '12px 20px';
    toast.style.borderRadius = '8px';
    toast.style.boxShadow = '0 10px 15px rgba(0,0,0,0.3)';
    toast.style.zIndex = '9999';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
  }

  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add('show');
  }

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('show');
  }
}

window.app = new WorkSphereApp();
