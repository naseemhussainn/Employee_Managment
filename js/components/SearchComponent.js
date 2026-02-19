import { debounce } from '../utils/helpers.js';

export class SearchComponent {
  constructor(el, onChange) {
    this.el = el;
    this.onChange = onChange;
    this.selectedDepts = [];
    this.render();
  }

  render() {
    this.el.innerHTML = `
      <div class="search-wrap">
        <input type="text" id="search-box" placeholder="Search by name, email, role..." />
        <select id="status-select">
          <option value="All">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>
      <div id="dept-chips" class="dept-chips"></div>
    `;

    const searchBox = this.el.querySelector('#search-box');
    const statusSelect = this.el.querySelector('#status-select');

    searchBox.addEventListener('input', debounce(() => this.onChange('query', searchBox.value), 250));
    statusSelect.addEventListener('change', () => this.onChange('status', statusSelect.value));
  }

  setDepartments(depts) {
    const container = this.el.querySelector('#dept-chips');
    container.innerHTML = depts.map(d => `
      <label class="chip">
        <input type="checkbox" value="${d}"> ${d}
      </label>
    `).join('');

    container.querySelectorAll('input').forEach(cb => {
      cb.addEventListener('change', () => {
        if (cb.checked) this.selectedDepts.push(cb.value);
        else this.selectedDepts = this.selectedDepts.filter(d => d !== cb.value);
        this.onChange('departments', this.selectedDepts);
      });
    });
  }
}
