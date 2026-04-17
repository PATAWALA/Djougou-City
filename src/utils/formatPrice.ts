export const formatFCFA = (montant: number): string => {
  if (montant === 0) return 'Gratuit';
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    maximumFractionDigits: 0,
  }).format(montant);
};

export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

export const formatNombre = (nombre: number): string => {
  if (nombre >= 1000) {
    return (nombre / 1000).toFixed(1) + 'k';
  }
  return nombre.toString();
};