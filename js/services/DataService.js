import { EmployeeAPI } from '../api/EmployeeAPI.js';
import { EmployeeCollection } from '../models/EmployeeCollection.js';

export class DataService {
  constructor() {
    this.api = new EmployeeAPI();
    this.collection = new EmployeeCollection();

    this.query = '';
    this.departments = [];
    this.status = 'All';
  }

  // added random salary/status becuase the API doesn't have it
  async initialCall() {
    const users = await this.api.getAll();
    users.forEach(u => {
      u.salary = Math.floor(Math.random() * 70000) + 35000;
      u.status = Math.random() > 0.2 ? 'Active' : 'Inactive';
      u.joinDate = this.randomDate();
    });
    this.collection.load(users);
  }

  randomDate() {
    const d = new Date(2018, 0, 1);
    d.setDate(d.getDate() + Math.floor(Math.random() * 2000));
    return d.toISOString().split('T')[0];
  }

  async addEmployee(data) {
    await this.api.create(data); // mock call - API returns fake id
    this.collection.add(data);
  }

  async deleteEmployee(id) {
    await this.api.delete(id);
    this.collection.remove(id);
  }

  getFiltered() {
    return this.collection.filter(this.query, this.departments, this.status);
  }

  setSearch(query) {
     this.query = query; 
  }
  setDepartments(depts) {
     this.departments = depts; 
  }
  setStatus(status) {
     this.status = status; 
  }
  
  getDepartments() {
    return this.collection.getDepartments();
  }

  onChange(fn) {
    this.collection.onChange(fn);
  }
}
