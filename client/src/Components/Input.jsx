import { Form } from 'react-bootstrap';

export const Input = ({
  label,
  type,
  placeholder,
  valueObject,
  style,
  required,
}) => {
  return (
    <Form.Group className="mb-3">
      <Form.Label>{label}</Form.Label>
      <Form.Control
        type={type}
        placeholder={placeholder}
        style={style}
        required={required}
      />
      {valueObject?.error.errorText && (
        <Form.Text className="text-muted">{valueObject.error.text}</Form.Text>
      )}
    </Form.Group>
  );
};
