import React from 'react';
import { Toast } from 'react-native-toast-message';

const ToastComponent = () => {
  const showErrorToast = (message) => {
    Toast.show({
      type: 'error',  
      text1: 'Erro',
      text2: message,
      visibilityTime: 1500,
      position: 'bottom', 
    });
  };

  const showSuccessToast = (message) => {
    Toast.show({
      type: 'success',  
      text1: 'Sucesso',
      text2: message,
      visibilityTime: 1500, 
      position: 'bottom', 
    });
  };

  return { showErrorToast, showSuccessToast };
};

export default ToastComponent;
