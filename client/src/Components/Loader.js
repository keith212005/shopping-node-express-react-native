import React from 'react';
import { TailSpin } from 'react-loader-spinner';

export const Loader = () => {
  return (
    <TailSpin
      color="#00BFFF"
      height={80}
      width={80}
      wrapperStyle={{ position: 'absolute', alignSelf: 'center' }}
    />
  );
};
