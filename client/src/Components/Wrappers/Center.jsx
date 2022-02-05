import styled from 'styled-components';

export const Center = ({ children }) => {
  const CenterContent = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
  `;
  return <CenterContent>{children}</CenterContent>;
};
