import { useState, useCallback } from "react";

export function useFormValidation(rules) {
  const [errors, setErrors] = useState({});

  const validate = useCallback((formData) => {
    const newErrors = {};
    for (const [field, check] of Object.entries(rules)) {
      const msg = check(formData[field], formData);
      if (msg) newErrors[field] = msg;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [rules]);

  const clearError = useCallback((field) => {
    setErrors(prev => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  const clearAll = useCallback(() => setErrors({}), []);

  return { errors, validate, clearError, clearAll };
}

// Rule helpers
export const v = {
  required:     (label) => (val) => (!val && val !== 0) || String(val).trim() === '' ? `${label} wajib diisi` : null,
  positiveInt:  (label) => (val) => !val || parseInt(val) <= 0 ? `${label} wajib dipilih` : null,
  int:          (label, min = 0) => (val) => { const n = parseInt(val); return isNaN(n) ? `${label} harus angka` : n < min ? `${label} minimal ${min}` : null; },
  decimal:      (label, min = 0) => (val) => { const n = parseFloat(String(val||'').replace(/\./g,'')); return isNaN(n) ? `${label} harus angka` : n < min ? `${label} minimal ${min}` : null; },
  requiredDate: (label) => (val) => !val ? `${label} wajib diisi` : null,
  minLength:    (label, min) => (val) => !val || String(val).length < min ? `${label} minimal ${min} karakter` : null,
  maxRef:       (label, ref, refLabel) => (val, form) => (parseInt(val)||0) > (parseInt(form[ref])||0) ? `${label} tidak boleh > ${refLabel}` : null,
  etaAfterFactory: () => (val, form) => form.tanggalKeluarPabrik && val && new Date(val) < new Date(form.tanggalKeluarPabrik) ? 'ETA tidak boleh sebelum Tgl Keluar Pabrik' : null,
};