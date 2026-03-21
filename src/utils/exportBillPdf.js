/**
 * exportBillPdf.js
 * Mở cửa sổ in với layout hóa đơn được định dạng đẹp.
 * Người dùng chọn "Save as PDF" trong hộp thoại in của trình duyệt.
 */

const fmtVND = (n) =>
  n != null
    ? new Intl.NumberFormat("vi-VN", { minimumFractionDigits: 0 }).format(n) + " ₫"
    : "—";

const fmtDate = (s) =>
  s ? new Date(s).toLocaleDateString("vi-VN") : "—";

export function exportBillPdf(bill, displayItems = null, displayAmount = null) {
  const items = displayItems ?? bill?.details ?? [];
  const totalAmount = displayAmount ?? bill?.totalAmount ?? 0;

  const rows = items
    .map(
      (item, idx) => `
      <tr class="${idx % 2 === 0 ? "row-even" : "row-odd"}">
        <td>${idx + 1}</td>
        <td>${item.description ?? "—"}</td>
        <td class="center">${Number(item.quantity ?? 0)}</td>
        <td class="right">${fmtVND(item.unitPrice)}</td>
        <td class="right">${(item.taxRate ?? 0)}%</td>
        <td class="right amount">${fmtVND(item.totalLine ?? item.amount)}</td>
      </tr>`
    )
    .join("");

  const html = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <title>Hóa đơn – ${bill?.periodCode ?? ""}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;800&display=swap');

    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Be Vietnam Pro', 'Segoe UI', sans-serif;
      background: #fff;
      color: #1e293b;
      font-size: 13px;
    }

    /* ── Page wrapper ── */
    .page {
      max-width: 760px;
      margin: 0 auto;
      padding: 40px 48px 60px;
    }

    /* ── Header ── */
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 32px;
      padding-bottom: 24px;
      border-bottom: 2px solid #e2e8f0;
    }
    .brand { }
    .brand-name {
      font-size: 22px;
      font-weight: 800;
      color: #1d4ed8;
      letter-spacing: -0.5px;
    }
    .brand-sub {
      font-size: 11px;
      color: #94a3b8;
      margin-top: 2px;
    }
    .invoice-title {
      text-align: right;
    }
    .invoice-title h1 {
      font-size: 26px;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -1px;
    }
    .invoice-title .period {
      font-size: 13px;
      color: #64748b;
      margin-top: 4px;
    }
    .status-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 700;
      margin-top: 6px;
    }
    .status-UNPAID  { background: #fee2e2; color: #b91c1c; }
    .status-PAID    { background: #d1fae5; color: #065f46; }
    .status-PARTIAL { background: #fef3c7; color: #92400e; }

    /* ── Info grid ── */
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-bottom: 28px;
    }
    .info-box {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 12px 14px;
    }
    .info-label {
      font-size: 10px;
      font-weight: 700;
      color: #94a3b8;
      letter-spacing: 0.6px;
      text-transform: uppercase;
      margin-bottom: 4px;
    }
    .info-value {
      font-size: 14px;
      font-weight: 600;
      color: #0f172a;
      word-break: break-all;
    }

    /* ── Table ── */
    .section-title {
      font-size: 13px;
      font-weight: 700;
      color: #334155;
      margin-bottom: 10px;
      padding-bottom: 6px;
      border-bottom: 1px solid #e2e8f0;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 24px;
      font-size: 12.5px;
    }
    thead th {
      padding: 9px 10px;
      background: #1d4ed8;
      color: #fff;
      font-weight: 700;
      font-size: 11px;
      letter-spacing: 0.3px;
    }
    thead th:first-child  { border-radius: 6px 0 0 0; text-align: center; }
    thead th:last-child   { border-radius: 0 6px 0 0; }
    .row-even td { background: #fff; }
    .row-odd  td { background: #f8fafc; }
    td {
      padding: 9px 10px;
      border-bottom: 1px solid #f1f5f9;
      vertical-align: middle;
    }
    .center { text-align: center; }
    .right  { text-align: right; }
    .amount { font-weight: 700; color: #1d4ed8; }

    /* ── Summary ── */
    .summary {
      margin-left: auto;
      width: 300px;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      overflow: hidden;
      margin-bottom: 32px;
    }
    .summary-row {
      display: flex;
      justify-content: space-between;
      padding: 10px 16px;
      font-size: 13px;
      border-bottom: 1px solid #f1f5f9;
    }
    .summary-row:last-child { border-bottom: none; }
    .summary-row.total {
      background: #1d4ed8;
      color: #fff;
      font-weight: 800;
      font-size: 15px;
    }
    .summary-row .label { color: #64748b; }
    .summary-row.total .label { color: rgba(255,255,255,0.8); }

    /* ── Footer ── */
    .footer {
      margin-top: 40px;
      padding-top: 16px;
      border-top: 1px solid #e2e8f0;
      display: flex;
      justify-content: space-between;
      font-size: 11px;
      color: #94a3b8;
    }

    /* ── Print ── */
    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .page { padding: 20px 28px 40px; }
    }
  </style>
</head>
<body>
<div class="page">
  <!-- Header -->
  <div class="header">
    <div class="brand">
      <div class="brand-name">ABMS</div>
      <div class="brand-sub">Apartment Building Management System</div>
    </div>
    <div class="invoice-title">
      <h1>HÓA ĐƠN</h1>
      <div class="period">Kỳ thanh toán: ${bill?.periodCode ?? "—"}</div>
      <span class="status-badge status-${bill?.status ?? "UNPAID"}">
        ${{ UNPAID: "Chưa thanh toán", PAID: "Đã thanh toán", PARTIAL: "Thanh toán một phần" }[bill?.status] ?? bill?.status ?? "—"}
      </span>
    </div>
  </div>

  <!-- Info grid -->
  <div class="info-grid">
    <div class="info-box">
      <div class="info-label">Mã hóa đơn</div>
      <div class="info-value" style="font-size:11px;">${bill?.id ?? "—"}</div>
    </div>
    <div class="info-box">
      <div class="info-label">Căn hộ</div>
      <div class="info-value">${bill?.apartmentCode ?? "—"}</div>
    </div>
    <div class="info-box">
      <div class="info-label">Ngày phát hành</div>
      <div class="info-value">${fmtDate(bill?.issuedAt)}</div>
    </div>
    <div class="info-box">
      <div class="info-label">Hạn thanh toán</div>
      <div class="info-value">${fmtDate(bill?.dueDate)}</div>
    </div>
  </div>

  <!-- Items table -->
  <div class="section-title">Chi tiết các khoản thu</div>
  <table>
    <thead>
      <tr>
        <th style="width:36px">STT</th>
        <th style="text-align:left">Nội dung</th>
        <th style="width:60px;text-align:center">SL</th>
        <th style="width:110px;text-align:right">Đơn giá</th>
        <th style="width:60px;text-align:right">Thuế</th>
        <th style="width:120px;text-align:right">Thành tiền</th>
      </tr>
    </thead>
    <tbody>
      ${rows || '<tr><td colspan="6" style="text-align:center;color:#94a3b8;padding:20px">Không có khoản thu nào</td></tr>'}
    </tbody>
  </table>

  <!-- Summary -->
  <div class="summary">
    <div class="summary-row">
      <span class="label">Tạm tính</span>
      <span>${fmtVND(bill?.subtotal)}</span>
    </div>
    <div class="summary-row">
      <span class="label">Thuế VAT</span>
      <span>${fmtVND(bill?.taxTotal)}</span>
    </div>
    <div class="summary-row total">
      <span class="label">TỔNG CỘNG</span>
      <span>${fmtVND(totalAmount)}</span>
    </div>
  </div>

  <!-- Footer -->
  <div class="footer">
    <span>Xuất ngày: ${new Date().toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" })}</span>
    <span>Tài liệu này được tạo tự động bởi hệ thống ABMS</span>
  </div>
</div>

<script>
  window.onload = function () {
    window.print();
    window.onafterprint = function () { window.close(); };
  };
</script>
</body>
</html>`;

  const win = window.open("", "_blank", "width=900,height=700");
  if (!win) {
    alert("Vui lòng cho phép popup để xuất PDF");
    return;
  }
  win.document.write(html);
  win.document.close();
}
