export class PaginationComponent {
  constructor(el, onChange) {
    this.el = el;
    this.onChange = onChange;
    this.page = 1;
    this.perPage = 15;
    this.total = 0;
  }

  get totalPages() {
    return Math.max(1, Math.ceil(this.total / this.perPage));
  }

  get offset() {
    return (this.page - 1) * this.perPage;
  }

  setTotal(total) {
    this.total = total;
    if (this.page > this.totalPages) this.page = 1;
    this.render();
  }

  reset() {
    this.page = 1;
  }

  render() {
    const { page, totalPages, total, perPage } = this;
    const from = total === 0 ? 0 : this.offset + 1;
    const to = Math.min(page * perPage, total);

    this.el.innerHTML = `
      <div class="pagination">
        <span class="pg-info">Showing ${from}–${to} of ${total}</span>
        <div class="pg-btns">
          <button class="pg-btn" id="pg-prev" ${page === 1 ? 'disabled' : ''}>Prev</button>
          ${this.pageButtons()}
          <button class="pg-btn" id="pg-next" ${page === totalPages ? 'disabled' : ''}>Next</button>
        </div>
        <select class="per-page-select">
          ${[10, 15, 25, 50].map(n => `<option ${n === perPage ? 'selected' : ''} value="${n}">${n} / page</option>`).join('')}
        </select>
      </div>
    `;

    this.el.querySelector('#pg-prev').onclick = () => this.go(page - 1);
    this.el.querySelector('#pg-next').onclick = () => this.go(page + 1);
    this.el.querySelectorAll('.pg-num').forEach(btn => {
      btn.onclick = () => this.go(Number(btn.dataset.p));
    });
    this.el.querySelector('.per-page-select').onchange = (e) => {
      this.perPage = Number(e.target.value);
      this.page = 1;
      this.emit();
      this.render();
    };
  }

  pageButtons() {
    let html = '';
    for (let i = 1; i <= this.totalPages; i++) {
      if (i === 1 || i === this.totalPages || (i >= this.page - 1 && i <= this.page + 1)) {
        html += `<button class="pg-btn pg-num ${i === this.page ? 'active' : ''}" data-p="${i}">${i}</button>`;
      } else if (!html.endsWith('<span class="dots">...</span>')) {
        html += '<span class="dots">...</span>';
      }
    }
    return html;
  }

  go(p) {
    this.page = Math.min(Math.max(1, p), this.totalPages);
    this.emit();
    this.render();
  }

  emit() {
    this.onChange(this.page, this.offset, this.perPage);
  }
}
