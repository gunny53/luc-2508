export const formatCurrency = (amount: number, currency = 'VND') => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0
  }).format(amount)
}

export const formatSold = (sold: number): string => {
  if (sold >= 1000) {
    const thousands = sold / 1000
    
    const formatted = thousands.toFixed(1).replace(/\.0$/, '')
    return `${formatted}k`
  }
  return sold.toString()
}
