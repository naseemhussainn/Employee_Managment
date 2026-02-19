export class Employee {
  constructor(data) {
    this.id = data.id;
    this.name = `${data.firstName} ${data.lastName}`;
    this.email = data.email;
    this.phone = data.phone;
    this.department = data.company?.department || data.department || 'N/A';
    this.role = data.company?.title || data.role || 'Employee';
    this.age = data.age;
    this.avatar = data.image || '';
    this.status = data.status || 'Active';
    this.salary = data.salary || 50000;
    this.joinDate = data.joinDate || '2022-01-01';
  }

  toJSON() {
    return { ...this };
  }
}
