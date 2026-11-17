export const PRICES = Object.freeze({ adults: 299, children: 89, refill: 29, water: 10, soda: 25 })
export const DISCOUNTS = [0, 10, 15, 20]
export const INITIAL_FORM = Object.freeze({
  adults: '', children: '', drinkType: 'refill', water: '', soda: '', discount: '0',
})

export function calculateBuffet(form) {
  const errors = {}
  const counts = {}
  const fields = form.drinkType === 'bottled'
    ? ['adults', 'children', 'water', 'soda']
    : ['adults', 'children']

  for (const field of fields) {
    const value = Number(form[field] ?? '')
    if (!Number.isSafeInteger(value) || value < 0) {
      errors[field] = 'กรุณาป้อนจำนวนเต็มตั้งแต่ 0 ขึ้นไป'
    } else {
      counts[field] = value
    }
  }

  if (!errors.adults && !errors.children && counts.adults + counts.children === 0) {
    errors.adults = 'กรุณาป้อนจำนวนผู้ใหญ่หรือเด็กอย่างน้อย 1 คน'
  }
  if (!['refill', 'bottled'].includes(form.drinkType)) {
    errors.drinkType = 'กรุณาเลือกประเภทเครื่องดื่ม'
  }
  const discount = Number(form.discount)
  if (!DISCOUNTS.includes(discount)) {
    errors.discount = 'กรุณาเลือกส่วนลดจากรายการ'
  }
  if (Object.keys(errors).length) return { errors, total: 0 }

  // คิดเป็นสตางค์ เพื่อให้ส่วนลดและยอดรวมไม่คลาดเคลื่อนจากทศนิยม
  const foodSatang = (counts.adults * PRICES.adults + counts.children * PRICES.children) * 100
  const discountSatang = Math.round(foodSatang * discount / 100)
  const drinkSatang = form.drinkType === 'refill'
    ? (counts.adults + counts.children) * PRICES.refill * 100
    : (counts.water * PRICES.water + counts.soda * PRICES.soda) * 100
  const totalSatang = foodSatang - discountSatang + drinkSatang

  if (![foodSatang, discountSatang, drinkSatang, totalSatang].every(Number.isSafeInteger)) {
    return { errors: { adults: 'จำนวนมากเกินไป กรุณาตรวจสอบข้อมูลอีกครั้ง' }, total: 0 }
  }

  return {
    errors,
    foodSubtotal: foodSatang / 100,
    discountAmount: discountSatang / 100,
    drinkSubtotal: drinkSatang / 100,
    total: totalSatang / 100,
  }
}
