import 'react-toastify/dist/ReactToastify.css';
import { Form } from 'react-bootstrap';
import styled from 'styled-components';
import { SubmitButton } from '../../components/SubmitButton';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { setStorageItem, getStorageItem } from '../../storage/LocalStorage';
import { Api, storageKey } from '../../constants/keys';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { Formik } from 'formik';
import { useState } from 'react';
import { Loader } from '../../components/Loader';

export const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [cookies, setCookie, removeCookie] = useCookies(['access_token']);

  const showErrorToast = (message) => {
    toast.error(message, {
      position: 'top-center',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const getUserInfoAndStoreInLocalStorage = () => {
    return new Promise((resolve, reject) => {
      const username = { username: getStorageItem(storageKey.EMAIL) };
      const accessToken = getStorageItem(storageKey.ACCESS_TOKEN);
      axios({
        method: 'post',
        baseURL: process.env.REACT_APP_API_URL,
        url: Api.GET_USER_INFO,
        data: username,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then((res) => {
          console.log('result>>>>>', res);
          setStorageItem(storageKey.USER_INFO, res.data.data);
          resolve();
        })
        .catch((e) => console.log('eeee>>>>>>>>>', e.response));
    });
  };

  return (
    <Container>
      <Formik
        initialValues={{ email: '', password: '' }}
        validate={(values) => {
          const errors = {};
          if (!values.email) {
            errors.email = 'Required';
          } else if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
          ) {
            errors.email = 'Invalid email address';
          }
          return errors;
        }}
        onSubmit={(values, { setSubmitting }) => {
          setLoading(true);
          const email = values.email;
          const password = values.password;
          const data = { username: email, password: password };

          fetch('http://localhost:5000/api/login', {
            method: 'POST', // or 'PUT'
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
          })
            .then((response) => response.json())
            .then((data) => {
              if (data && data.accessToken) {
                setStorageItem(storageKey.ACCESS_TOKEN, data.accessToken);
                setStorageItem(storageKey.REFRESH_TOKEN, data.refreshToken);
                setStorageItem(storageKey.EMAIL, email);
                getUserInfoAndStoreInLocalStorage()
                  .then(() => {
                    setTimeout(() => {
                      navigate('/dashboard', { replace: true });
                    }, 500);
                  })
                  .catch((e) => {
                    showErrorToast('Error: Something went wrong');
                    setLoading(false);
                  });
              } else {
                showErrorToast(data && data.message);
                setLoading(false);
              }
            })
            .catch((error) => {
              showErrorToast('Error: Something went wrong');
              setLoading(false);
            });
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
          /* and other goodies */
        }) => (
          <Form method="GET" onSubmit={handleSubmit}>
            <label style={styles.loginLabel}>Login</label>

            {/* Render Email */}
            <label style={{ width: '100%', textAlign: 'left' }}>
              {'Email Address'}
            </label>
            <Form.Control
              type={'email'}
              name={'email'}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.email}
            />
            <label style={{ width: '100%', textAlign: 'left', color: 'red' }}>
              {errors.email && touched.email && errors.email}
            </label>

            {/* Render Password */}
            <label style={{ width: '100%', textAlign: 'left' }}>
              {'Password'}
            </label>
            <Form.Control
              type={'password'}
              name={'password'}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.password}
            />
            <label style={{ width: '100%', textAlign: 'left', color: 'red' }}>
              {errors.password && touched.password && errors.password}
            </label>
            <Form.Group
              className="mb-3"
              controlId="formBasicCheckbox"
              style={{ margin: '2rem' }}
            />

            {/* Render Submit */}
            <SubmitButton
              title="Login"
              type={'submit'}
              style={{ width: 400 }}
            />
          </Form>
        )}
      </Formik>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      {loading && <Loader />}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  height: 100vh;
  justify-content: center;
  margin: 10rem 0rem;
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
