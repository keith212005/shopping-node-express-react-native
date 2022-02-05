import { Form } from 'react-bootstrap';
import { Center } from '../../Components/Wrappers/Center';
import { Input } from '../../Components/Input';
import { SubmitButton } from '../../Components/SubmitButton';
import { useState } from 'react';

export const Register = () => {
  const [userInfo, setUserInfo] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    const userData = {
      firstName: event.target[0].value,
      lastName: event.target[1].value,
      email: event.target[2].value,
      password: event.target[3].value,
    };

    fetch('http://localhost:5000/api/register', {
      method: 'POST', // or 'PUT'
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Success:', data);
        setUserInfo(JSON.stringify(data));
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  return (
    <Center>
      <div style={{ width: 300 }}>
        <label style={styles.loginLabel}>Register</label>
        <Form method="GET" onSubmit={handleSubmit}>
          <Input
            label={'First name'}
            type={'text'}
            placeholder={'Enter first name'}
            required={true}
          />
          <Input
            label={'Last name'}
            type={'text'}
            placeholder={'Enter last name'}
            required={true}
          />

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
          <Input
            label={'Confirm Password'}
            type={'password'}
            placeholder={'Password'}
            required={true}
          />

          <Form.Group className="mb-3" controlId="formBasicCheckbox">
            <Form.Check type="checkbox" label="Remember me" />
          </Form.Group>

          <SubmitButton title="Submit" type={'submit'} onClick={() => {}} />

          {userInfo && <label>{userInfo}</label>}
        </Form>
      </div>
    </Center>
  );
};

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
