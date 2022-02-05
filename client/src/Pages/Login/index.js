import { Form } from 'react-bootstrap';
import styled from 'styled-components';
import { Input } from '../../Components/Input';
import { SubmitButton } from '../../Components/SubmitButton';
import { useNavigate, Outlet } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Center } from '../../Components/Wrappers/Center';

export const Login = () => {
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    navigate(`/dashboard`, { replace: true });
    const data = {
      username: event.target[0].value,
      password: event.target[1].value,
    };

    fetch('http://localhost:5000/api/authenticate', {
      method: 'POST', // or 'PUT'
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) navigate(`/dashboard`, { replace: true });
      })
      .catch((error) => console.error('Error:', error));
  };

  return (
    <Container>
      <Form method="GET" onSubmit={handleSubmit}>
        <ArrowBackIcon onClick={() => navigate('/')} />
        <label style={styles.loginLabel}>Login</label>
        <Input
          label={'Email address'}
          type={'text'}
          placeholder={'Enter Email'}
          required={true}
        />
        <Input
          label={'Password'}
          type={'password'}
          placeholder={'Password'}
          required={true}
        />

        <Form.Group className="mb-3" controlId="formBasicCheckbox">
          <Form.Check type="checkbox" label="Remember me" />
        </Form.Group>

        <SubmitButton title="Submit" type={'submit'} style={{ width: 400 }} />
      </Form>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  height: 100vh;
  justify-content: center;
  align-items: center;
`;

const styles = {
  loginLabel: {
    fontSize: 50,
    alignSelf: 'center',
    width: '100%',
    textAlign: 'center',
    marginBottom: 50,
    color: 'dodgerblue',
  },
};
