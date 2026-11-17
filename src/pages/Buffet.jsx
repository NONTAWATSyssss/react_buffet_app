import { useState } from 'react'
import buffet from '../assets/buffet.svg'
import NumberField from '../components/NumberField.jsx'
import DiscountSelect from '../components/DiscountSelect.jsx'
import { calculateBuffet, INITIAL_FORM, PRICES } from '../utils/buffet.js'

const currency = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export default function Buffet() {
  const [form, setForm] = useState({ ...INITIAL_FORM })
  const [errors, setErrors] = useState({})
  const [result, setResult] = useState(null)
  const isRefill = form.drinkType === 'refill'

  function handleChange(event) {
    const { name, value } = event.target
    setForm(current => ({ ...current, [name]: value }))
    setErrors({})
    setResult(null)
  }

  function handleCalculate(event) {
    event.preventDefault()
    const calculation = calculateBuffet(form)

    // แยกค่าที่ป้อนไม่สมบูรณ์ในช่อง number ออกจากช่องที่เว้นว่างจริง
    for (const name of ['adults', 'children', 'water', 'soda']) {
      const input = event.currentTarget.elements.namedItem(name)
      if (!input.disabled && input.validity.badInput) {
        calculation.errors[name] = 'กรุณาป้อนจำนวนเต็มตั้งแต่ 0 ขึ้นไป'
      }
    }

    setErrors(calculation.errors)
    if (Object.keys(calculation.errors).length) {
      setResult(null)
      const firstInvalidField = Object.keys(calculation.errors)[0]
      document.getElementById(firstInvalidField)?.focus()
      return
    }
    setResult(calculation)
  }

  function handleReset() {
    setForm({ ...INITIAL_FORM })
    setErrors({})
    setResult(null)
  }

  return (
    <main className="calculator-page">
      <header className="calculator-header">
        <h1 className="calculator-title">Buffet Calculator</h1>
        <p className="calculator-subtitle">คำนวณค่าอาหารบุฟเฟต์</p>
        <div className="calculator-art">
          <img src={buffet} alt="หม้อบุฟเฟต์" width="82" height="82" />
        </div>
      </header>

      <form className="calculator-form" onSubmit={handleCalculate} onReset={handleReset} noValidate>
        {/* จำนวนผู้รับประทาน */}
        <NumberField
          name="adults" label="จำนวนผู้ใหญ่" rate={`คนละ ${PRICES.adults} บาท`}
          value={form.adults} onChange={handleChange} error={errors.adults}
        />
        <NumberField
          name="children" label="จำนวนเด็ก" rate={`คนละ ${PRICES.children} บาท`}
          value={form.children} onChange={handleChange} error={errors.children}
        />

        {/* เลือกรีฟิลหรือแบบขวด โดยช่องจำนวนขวดใช้ได้เฉพาะแบบขวด */}
        <fieldset className="drink-field">
          <legend>เครื่องดื่ม</legend>
          <div className="drink-options">
            <label className="drink-option">
              <input
                type="radio" name="drinkType" value="refill"
                checked={isRefill} onChange={handleChange}
              />
              <span>น้ำรีฟิล คนละ {PRICES.refill} บาท (ผู้ใหญ่และเด็ก)</span>
            </label>
            <label className="drink-option">
              <input
                type="radio" name="drinkType" value="bottled"
                checked={!isRefill} onChange={handleChange}
              />
              <span>เครื่องดื่มแบบขวด</span>
            </label>
          </div>
          {errors.drinkType && <p className="field-error" role="alert">{errors.drinkType}</p>}
          <div className="bottle-fields">
            <NumberField
              name="water" label="น้ำเปล่า" rate={`ขวดละ ${PRICES.water} บาท`}
              value={form.water} onChange={handleChange} disabled={isRefill} error={errors.water}
            />
            <NumberField
              name="soda" label="น้ำอัดลม" rate={`ขวดละ ${PRICES.soda} บาท`}
              value={form.soda} onChange={handleChange} disabled={isRefill} error={errors.soda}
            />
          </div>
        </fieldset>

        <div className="form-field discount-field">
          <label id="discount-label" htmlFor="discount">บัตรส่วนลด</label>
          <DiscountSelect value={form.discount} onChange={handleChange} error={errors.discount} />
          <p id="discount-note" className="field-hint">ลดเฉพาะค่าอาหารทั้งหมด ไม่รวมเครื่องดื่ม</p>
          {errors.discount && <p className="field-error" role="alert">{errors.discount}</p>}
        </div>

        <div className="form-actions">
          <button type="submit" className="button button-primary">คำนวณ</button>
          <button type="reset" className="button button-secondary">รีเซ็ต</button>
        </div>
      </form>

      <section className="result-panel" role="status" aria-live="polite" aria-atomic="true">
        <p className="result-label">ยอดชำระทั้งหมด:</p>
        <p className="result-value">
          <span className="result-number">{currency.format(result?.total ?? 0)}</span>
          <span className="result-unit">บาท</span>
        </p>
      </section>
    </main>
  )
}
