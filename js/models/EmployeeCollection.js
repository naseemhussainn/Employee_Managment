import { Employee } from './Employee.js';

export class EmployeeCollection {
  constructor() {
    this.employees = [];
    this.callbacks = [];
  }

  load(rawData) {
    this.employees = rawData.map(u => new Employee(u));
    this.notify();
  }

  add(data) {
    const newId = Math.max(...this.employees.map(e => e.id), 0) + 1;
    const emp = new Employee({ ...data, id: newId });
    this.employees.unshift(emp);
    this.notify();
    return emp;
  }

  remove(id) {
    this.employees = this.employees.filter(e => e.id !== id);
    this.notify();
  }

  getById(id) {
    return this.employees.find(e => e.id === id);
  }

  filter(query, departments, status) {
    return this.employees.filter(emp => {
      const q = query.toLowerCase();
      const matchSearch = !q || emp.name.toLowerCase().includes(q) 
        || emp.email.toLowerCase().includes(q) 
        || emp.role.toLowerCase().includes(q);
      const matchDept = departments.length === 0 || departments.includes(emp.department);
      const matchStatus = status === 'All' || emp.status === status;
      return matchSearch && matchDept && matchStatus;
    });
  }

  getDepartments() {
    const depts = this.employees.map(e => e.department);
    return [...new Set(depts)].sort();
  }

  onChange(fn) {
    this.callbacks.push(fn);
  }

  notify() {
    this.callbacks.forEach(fn => fn());
  }
}
