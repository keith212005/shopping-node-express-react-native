import { Button } from 'react-bootstrap';

export const SubmitButton = (props) => {
  return <Button {...props}>{props.title}</Button>;
};
