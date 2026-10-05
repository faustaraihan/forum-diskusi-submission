export default function FormField({ id, label, help, multiline = false, ...props }) {
  const Input = multiline ? 'textarea' : 'input';
  return <div className="form-field"><label htmlFor={id}>{label}</label><Input id={id} aria-describedby={help ? `${id}-help` : undefined} {...props} />{help && <span className="field-help" id={`${id}-help`}>{help}</span>}</div>;
}
