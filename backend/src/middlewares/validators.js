/**
 * validators.js — Validasi terpusat semua endpoint.
 * Response error: { success: false, message, errors: { field: 'pesan' } }
 */
const sendErrors = (res, errors) =>
  res.status(422).json({ success: false, message: 'Validasi gagal', errors });

const validate = (ruleSet) => (req, res, next) => {
  const errors = {};
  for (const [field, checks] of Object.entries(ruleSet)) {
    const value = req.body[field];
    for (const check of checks) {
      const msg = check(value, req.body);
      if (msg) { errors[field] = msg; break; }
    }
  }
  if (Object.keys(errors).length > 0) return sendErrors(res, errors);
  next();
};

const r = {
  required:     (label) => (v) => (!v && v !== 0) || String(v).trim() === '' ? `${label} wajib diisi` : null,
  int:          (label, min = 0) => (v) => { const n = parseInt(v); return isNaN(n) ? `${label} harus angka` : n < min ? `${label} minimal ${min}` : null; },
  positiveInt:  (label) => (v) => { const n = parseInt(v); return (isNaN(n) || n <= 0) ? `${label} harus angka > 0` : null; },
  decimal:      (label, min = 0) => (v) => { const n = parseFloat(v); return isNaN(n) ? `${label} harus angka` : n < min ? `${label} minimal ${min}` : null; },
  date:         (label) => (v) => v && isNaN(new Date(v).getTime()) ? `${label} tanggal tidak valid` : null,
  requiredDate: (label) => (v) => !v ? `${label} wajib diisi` : isNaN(new Date(v).getTime()) ? `${label} tanggal tidak valid` : null,
  enum:         (label, opts) => (v) => !opts.includes(v) ? `${label} harus salah satu: ${opts.join(', ')}` : null,
  maxLength:    (label, max) => (v) => v && String(v).length > max ? `${label} maks ${max} karakter` : null,
  minLength:    (label, min) => (v) => !v || String(v).length < min ? `${label} min ${min} karakter` : null,
  maxRef:       (label, ref, refLabel) => (v, body) => (parseInt(v)||0) > (parseInt(body[ref])||0) ? `${label} tidak boleh > ${refLabel}` : null,
  etaAfterFactory: () => (v, body) => body.tanggalKeluarPabrik && v && new Date(v) < new Date(body.tanggalKeluarPabrik) ? 'ETA tidak boleh sebelum Tgl Keluar Pabrik' : null,
};

const rules = {
  register:         { username: [r.required('Username'), r.maxLength('Username',50)], password: [r.required('Password'), r.minLength('Password',6)] },
  login:            { username: [r.required('Username')], password: [r.required('Password')] },
  brand:            { name: [r.required('Nama brand'), r.maxLength('Nama brand',100)] },
  subBrand:         { name: [r.required('Nama sub brand'), r.maxLength('Nama sub brand',100)], brandId: [r.required('Brand'), r.positiveInt('Brand ID')] },
  product:          { name: [r.required('Nama product'), r.maxLength('Nama product',150)], subBrandId: [r.required('Sub Brand'), r.positiveInt('Sub Brand ID')], hargaPerCarton: [r.required('Harga per karton'), r.decimal('Harga per karton',0)], qtyPerCarton: [r.required('Qty per karton'), r.positiveInt('Qty per karton')] },
  leadtime:         { brandId: [r.required('Brand'), r.positiveInt('Brand ID')], subBrandId: [r.required('Sub Brand'), r.positiveInt('Sub Brand ID')], productId: [r.required('Product'), r.positiveInt('Product ID')], qtyOrder: [r.required('Qty Order'), r.int('Qty Order',1)], eta: [r.requiredDate('ETA'), r.etaAfterFactory()], status: [r.enum('Status', ['Pending','In Transit','Delivered','Delayed','Cancelled'])], tanggalKeluarPabrik: [r.date('Tgl Keluar Pabrik')], notes: [r.maxLength('Notes',500)] },
  stockIndomaret:   { brandId: [r.required('Brand'), r.positiveInt('Brand ID')], subBrandId: [r.required('Sub Brand'), r.positiveInt('Sub Brand ID')], productId: [r.required('Product'), r.positiveInt('Product ID')], avgL3m: [r.required('Avg L3M'), r.int('Avg L3M',0)], periodDate: [r.date('Period Date')] },
  serviceLevel:     { brandId: [r.required('Brand'), r.positiveInt('Brand ID')], subBrandId: [r.required('Sub Brand'), r.positiveInt('Sub Brand ID')], productId: [r.required('Product'), r.positiveInt('Product ID')], totalSales: [r.required('Total Sales'), r.int('Total Sales',0)], actualSales: [r.required('Actual Sales'), r.int('Actual Sales',0), r.maxRef('Actual Sales','totalSales','Total Sales')], periodDate: [r.requiredDate('Period Date')] },
  stockDistributor: { brandId: [r.required('Brand'), r.positiveInt('Brand ID')], subBrandId: [r.required('Sub Brand'), r.positiveInt('Sub Brand ID')], productId: [r.required('Product'), r.positiveInt('Product ID')], stockQuantity: [r.required('Stock Quantity'), r.int('Stock Quantity',0)], avgL3m: [r.required('Avg L3M'), r.int('Avg L3M',0)], periodDate: [r.date('Period Date')] },
  forecast:         { brandId: [r.required('Brand'), r.positiveInt('Brand ID')], subBrandId: [r.required('Sub Brand'), r.positiveInt('Sub Brand ID')], productId: [r.required('Product'), r.positiveInt('Product ID')], week1: [r.required('Week 1'), r.decimal('Week 1',0)], week2: [r.required('Week 2'), r.decimal('Week 2',0)], week3: [r.required('Week 3'), r.decimal('Week 3',0)], week4: [r.required('Week 4'), r.decimal('Week 4',0)], periodDate: [r.requiredDate('Period Date')] },
};

module.exports = { validate, rules };