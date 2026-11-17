export default function NumberField({ name, label, rate, value, onChange, disabled = false, error }) {
  return (
    <div className="form-field">
      <label htmlFor={name}>
        {label} <span className="field-rate">({rate})</span>
      </label>
      <input
        id={name}
        name={name}
        type="number"
        inputMode="numeric"
        min="0"
        step="1"
        value={value}
        onChange={onChange}
        disabled={disabled}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${name}-error` : undefined}
        className="field-input"
      />
      {error && <p id={`${name}-error`} className="field-error" role="alert">{error}</p>}
    </div>
  )
}
