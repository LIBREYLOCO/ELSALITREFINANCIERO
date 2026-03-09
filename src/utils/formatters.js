export const MXN = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
});

/**
 * Currency formatter shorthand
 */
export function M(val) {
    return MXN.format(val || 0);
}
