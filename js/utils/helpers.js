export function debounce(fn, wait = 300) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn.apply(this, args), wait);
  };
}

export function formatSalary(num) {
  return '$' + num.toLocaleString();
}

export function downloadFile(content, filename, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = Object.assign(document.createElement('a'), { href: url, download: filename });
  a.click();
  URL.revokeObjectURL(url);
}

export function exportCSV(employees) {
  const headers = 'ID,Name,Email,Department,Role,Salary,Status,Join Date';
  const rows = employees.map(e =>
    `${e.id},"${e.name}",${e.email},"${e.department}","${e.role}",${e.salary},${e.status},${e.joinDate}`
  );
  downloadFile([headers, ...rows].join('\n'), 'employees.csv', 'text/csv');
}

export function exportJSON(employees) {
  downloadFile(JSON.stringify(employees.map(e => e.toJSON()), null, 2), 'employees.json', 'application/json');
}
