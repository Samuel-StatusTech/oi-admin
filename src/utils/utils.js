export const formatCNPJ = (cnpj) => {
  const x = String(cnpj)
    .replace(/\D/g, '')
    .match(/(\d{0,2})(\d{0,3})(\d{0,3})(\d{0,4})(\d{0,2})/);
  const p5 = x[5] ? `-${x[5]}` : '';
  const p4 = x[4] ? `/${x[4]}` : '';
  const p3 = x[3] ? `.${x[3]}` : '';
  const p2 = x[2] ? `.${x[2]}` : '';
  return `${x[1]}${p2}${p3}${p4}${p5}`;
};
