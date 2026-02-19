import { DataService } from './services/DataService.js';
import { TableComponent } from './components/TableComponent.js';
import { SearchComponent } from './components/SearchComponent.js';
import { PaginationComponent } from './components/PaginationComponent.js';
import { exportCSV, exportJSON } from './utils/helpers.js';

class App {
  constructor() {
    this.service = new DataService();
    this.filtered = [];
    this.currentOffset = 0;
    this.currentPerPage = 15;
  }

  async run() {
    const loader = document.getElementById('loader');
    loader.style.display = 'flex';

    try {
      await this.service.initialCall();
    } catch(e) {
      alert('Error loading data: ' + e.message);
      return;
    } finally {
      loader.style.display = 'none';
    }

    this.table = new TableComponent(
      document.getElementById('table-area'),
      (id) => this.confirmDelete(id)
    );

    this.search = new SearchComponent(
      document.getElementById('search-area'),
      (type, value) => {
        if (type === 'query') this.service.setSearch(value);
        if (type === 'status') this.service.setStatus(value);
        if (type === 'departments') this.service.setDepartments(value);
        this.pagination.reset();
        this.refresh();
      }
    );

    this.pagination = new PaginationComponent(
      document.getElementById('pagination-area'),
      (page, offset, perPage) => {
        this.currentOffset = offset;
        this.currentPerPage = perPage;
        this.renderTable();
      }
    );

    this.search.setDepartments(this.service.getDepartments());

    this.service.onChange(() => this.refresh());

    this.setupModal();
    this.setupExport();
    this.refresh();
  }

  refresh() {
    this.filtered = this.service.getFiltered();
    this.pagination.setTotal(this.filtered.length);
    this.renderTable();
    this.updateStats();
  }

  renderTable() {
    const page = this.filtered.slice(this.currentOffset, this.currentOffset + this.currentPerPage);
    this.table.render(page, this.currentOffset);
  }

  updateStats() {
    const all = this.service.collection.employees;
    document.getElementById('stat-total').textContent = all.length;
    document.getElementById('stat-active').textContent = all.filter(e => e.status === 'Active').length;
    document.getElementById('stat-filtered').textContent = this.filtered.length;
  }

  setupModal() {
    const modal = document.getElementById('add-modal');
    const form = document.getElementById('add-form');

    document.getElementById('open-modal').onclick = () => modal.style.display = 'flex';
    document.getElementById('close-modal').onclick = () => modal.style.display = 'none';
    modal.onclick = (e) => { if (e.target === modal) modal.style.display = 'none'; };

    form.onsubmit = async (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(form));
      data.salary = Number(data.salary);
      try {
        await this.service.addEmployee(data);
        form.reset();
        modal.style.display = 'none';
        this.search.setDepartments(this.service.getDepartments());
        this.showToast('Employee added!');
      } catch(err) {
        alert('Failed to add employee');
      }
    };

    // delete confirm
    const delModal = document.getElementById('del-modal');
    document.getElementById('cancel-del').onclick = () => delModal.style.display = 'none';
    document.getElementById('confirm-del').onclick = async () => {
      const id = Number(delModal.dataset.id);
      try {
        await this.service.deleteEmployee(id);
        delModal.style.display = 'none';
        this.showToast('Employee deleted.');
      } catch(err) {
        alert('Delete failed');
      }
    };
  }

  confirmDelete(id) {
    const emp = this.service.collection.getById(id);
    if (!emp) return;
    const modal = document.getElementById('del-modal');
    modal.dataset.id = id;
    modal.querySelector('#del-name').textContent = emp.name;
    modal.style.display = 'flex';
  }

  setupExport() {
    document.getElementById('export-csv').onclick = () => {
      exportCSV(this.filtered);
      this.showToast('CSV downloaded');
    };
    document.getElementById('export-json').onclick = () => {
      exportJSON(this.filtered);
      this.showToast('JSON downloaded');
    };
  }

  showToast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2500);
  }
}

const app = new App();
app.run();
