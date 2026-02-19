const BASE_URL = 'https://dummyjson.com/users';

export class EmployeeAPI {
  async getAll() {
    const res = await fetch(`${BASE_URL}?limit=100`);
    if (!res.ok) throw new Error('Failed to fetch users');
    const data = await res.json();
    return data.users;
  }

  async create(payload) {
    const res = await fetch(`${BASE_URL}/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.json();
  }

  async delete(id) {
    const res = await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' });
    return res.json();
  }
}
