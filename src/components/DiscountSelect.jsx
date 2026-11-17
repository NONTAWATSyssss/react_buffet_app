import { useEffect, useRef, useState } from 'react'
import { DISCOUNTS } from '../utils/buffet.js'

export default function DiscountSelect({ value, onChange, error }) {
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [opensAbove, setOpensAbove] = useState(false)
  const containerRef = useRef(null)
  const triggerRef = useRef(null)
  const selectedIndex = DISCOUNTS.indexOf(Number(value))

  useEffect(() => {
    if (!open) return
    function dismissOutside(event) {
      if (!containerRef.current?.contains(event.target)) setOpen(false)
    }
    function dismissOnResize() { setOpen(false) }
    document.addEventListener('pointerdown', dismissOutside)
    window.addEventListener('resize', dismissOnResize)
    return () => {
      document.removeEventListener('pointerdown', dismissOutside)
      window.removeEventListener('resize', dismissOnResize)
    }
  }, [open])

  function openMenu() {
    const bounds = triggerRef.current.getBoundingClientRect()
    setOpensAbove(window.innerHeight - bounds.bottom < 196 && bounds.top > 196)
    setActiveIndex(selectedIndex)
    setOpen(true)
  }

  function choose(index) {
    onChange({ target: { name: 'discount', value: String(DISCOUNTS[index]) } })
    setOpen(false)
    triggerRef.current.focus()
  }

  function handleKeyDown(event) {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      if (!open) openMenu()
      else setActiveIndex(index => (index + (event.key === 'ArrowDown' ? 1 : -1) + DISCOUNTS.length) % DISCOUNTS.length)
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault()
      if (!open) openMenu()
      setActiveIndex(event.key === 'Home' ? 0 : DISCOUNTS.length - 1)
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      if (open) choose(activeIndex)
      else openMenu()
    } else if (event.key === 'Escape' && open) {
      event.preventDefault()
      event.stopPropagation()
      setOpen(false)
    } else if (event.key === 'Tab') {
      setOpen(false)
    }
  }

  return (
    <div
      ref={containerRef} className="discount-select"
      onBlur={event => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false)
      }}
    >
      <input type="hidden" name="discount" value={value} />
      <button
        ref={triggerRef} id="discount" type="button" role="combobox"
        className={`field-input select-trigger${open ? ' is-open' : ''}`}
        aria-expanded={open} aria-haspopup="listbox"
        aria-controls={open ? 'discount-options' : undefined}
        aria-labelledby="discount-label discount-selection" aria-describedby="discount-note"
        aria-activedescendant={open ? `discount-option-${activeIndex}` : undefined}
        aria-invalid={error ? true : undefined}
        onClick={() => open ? setOpen(false) : openMenu()} onKeyDown={handleKeyDown}
      >
        <svg className="select-tag" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M20 13 11 4H4v7l9 9a2 2 0 0 0 3 0l4-4a2 2 0 0 0 0-3Z" />
          <path d="M8 8h.01" strokeWidth="3" />
        </svg>
        <span id="discount-selection">{Number(value) === 0 ? 'ไม่มีส่วนลด' : `ส่วนลด ${value}%`}</span>
        <svg className="select-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="m7 10 5 5 5-5" />
        </svg>
      </button>
      {open && (
        <div id="discount-options" role="listbox" aria-labelledby="discount-label" className={`select-menu${opensAbove ? ' is-above' : ''}`}>
          {DISCOUNTS.map((discount, index) => (
            <div
              key={discount} id={`discount-option-${index}`} role="option"
              aria-selected={String(discount) === value}
              className={`select-option${activeIndex === index ? ' is-active' : ''}`}
              onPointerMove={() => setActiveIndex(index)}
              onMouseDown={event => event.preventDefault()}
              onClick={() => choose(index)}
            >
              <span>{discount === 0 ? 'ไม่มีส่วนลด' : `ส่วนลด ${discount}%`}</span>
              {String(discount) === value && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="m5 12 4 4L19 6" />
                </svg>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
