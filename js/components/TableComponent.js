import { formatSalary } from '../utils/helpers.js';

export class TableComponent {
  constructor(el, onDelete) {
    this.el = el;
    this.onDelete = onDelete;
    this.data = [];
    this.sortBy = null;
    this.sortDir = 1;
    this.ROW_H = 52; // for virtual scroll

    this.el.innerHTML = `
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th><input type="checkbox" id="check-all" /></th>
              <th>#</th>
              <th data-col="name" class="sortable">Name</th>
              <th data-col="email" class="sortable">Email</th>
              <th data-col="department" class="sortable">Department</th>
              <th data-col="role" class="sortable">Role</th>
              <th data-col="salary" class="sortable">Salary</th>
              <th data-col="joinDate" class="sortable">Joined</th>
              <th data-col="status" class="sortable">Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody id="tbody"></tbody>
        </table>
        <div id="virtual-container" style="display:none; position:relative; overflow-y:auto; max-height:600px;">
          <div id="virtual-spacer"></div>
          <div id="virtual-content" style="position:absolute; top:0; width:100%;"></div>
        </div>
        <p id="no-results" style="display:none; text-align:center; padding:40px; color:#888;">No employees found.</p>
      </div>
    `;

    this.el.querySelectorAll('.sortable').forEach(th => {
      th.addEventListener('click', () => {
        const col = th.dataset.col;
        if (this.sortBy === col) this.sortDir *= -1;
        else { this.sortBy = col; this.sortDir = 1; }
        this.el.querySelectorAll('.sortable').forEach(t => t.classList.remove('asc', 'desc'));
        th.classList.add(this.sortDir === 1 ? 'asc' : 'desc');
        this.render(this.data, this.offset);
      });
    });

    this.el.querySelector('#check-all').addEventListener('change', function() {
      document.querySelectorAll('.row-check').forEach(c => c.checked = this.checked);
    });
  }

  render(employees, offset = 0) {
    this.data = employees;
    this.offset = offset;

    const tbody = this.el.querySelector('#tbody');
    const noResults = this.el.querySelector('#no-results');
    const virtualContainer = this.el.querySelector('#virtual-container');
    const table = this.el.querySelector('table');

    if (employees.length === 0) {
      tbody.innerHTML = '';
      noResults.style.display = 'block';
      table.style.display = 'none';
      virtualContainer.style.display = 'none';
      return;
    }

    noResults.style.display = 'none';

    // sort if needed
    let rows = [...employees];
    if (this.sortBy) {
      rows.sort((a, b) => {
        if (a[this.sortBy] < b[this.sortBy]) return -1 * this.sortDir;
        if (a[this.sortBy] > b[this.sortBy]) return 1 * this.sortDir;
        return 0;
      });
    }

    // use virtual scroll for big datasets
    if (employees.length > 200) {
      table.style.display = 'none';
      virtualContainer.style.display = 'block';
      this.virtualRender(rows, offset);
    } else {
      table.style.display = '';
      virtualContainer.style.display = 'none';
      tbody.innerHTML = rows.map((emp, i) => this.rowHTML(emp, offset + i + 1)).join('');
      this.bindDeleteBtns(tbody);
    }
  }

  virtualRender(employees, offset) {
    const container = this.el.querySelector('#virtual-container');
    const spacer = this.el.querySelector('#virtual-spacer');
    const content = this.el.querySelector('#virtual-content');
    spacer.style.height = employees.length * this.ROW_H + 'px';

    const draw = () => {
      const scrollTop = container.scrollTop;
      const start = Math.max(0, Math.floor(scrollTop / this.ROW_H) - 3);
      const end = Math.min(employees.length, start + 30);
      content.style.top = start * this.ROW_H + 'px';
      content.innerHTML = `
        <table style="width:100%; border-collapse:collapse;">
          <tbody>
            ${employees.slice(start, end).map((emp, i) => this.rowHTML(emp, start + i + 1)).join('')}
          </tbody>
        </table>
      `;
      this.bindDeleteBtns(content);
    };

    container.onscroll = draw;
    draw();
  }

  rowHTML(emp, num) {
    const statusClass = emp.status === 'Active' ? 'badge-active' : 'badge-inactive';
    return `
      <tr>
        <td><input type="checkbox" class="row-check" /></td>
        <td class="muted">${num}</td>
        <td>
          <div class="name-cell">
            <img src="${emp.avatar}" alt="${emp.name}" class="avatar" 
              onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(emp.name)}&size=32'" />
            <span>${emp.name}</span>
          </div>
        </td>
        <td class="muted small">${emp.email}</td>
        <td><span class="dept">${emp.department}</span></td>
        <td>${emp.role}</td>
        <td class="mono">${formatSalary(emp.salary)}</td>
        <td class="muted small">${emp.joinDate}</td>
        <td><span class="badge ${statusClass}">${emp.status}</span></td>
        <td>
          <button class="del-btn" data-id="${emp.id}">Delete</button>
        </td>
      </tr>
    `;
  }

  bindDeleteBtns(root) {
    root.querySelectorAll('.del-btn').forEach(btn => {
      btn.addEventListener('click', () => this.onDelete(Number(btn.dataset.id)));
    });
  }
}
