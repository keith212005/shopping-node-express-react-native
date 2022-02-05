// import { useLocation } from 'react-router';
import { Container } from 'react-bootstrap';
import { HomeNavBar } from '../../Components/NavBars/HomeNavBar';

export const Dashboards = () => {
  // const params = useParams();
  // let state = useLocation();
  // console.log('params>>>>>', state);
  return (
    <div>
      <HomeNavBar />
      <Container>
        <label>Hello </label>
      </Container>
    </div>
  );
};
