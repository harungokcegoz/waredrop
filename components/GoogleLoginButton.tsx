import React from 'react';
import { Button } from 'react-native';
import { useUserViewModel } from '../viewmodels/UserViewModel';

const GoogleLoginButton = () => {
  const { googleLogin } = useUserViewModel();

  const handleGoogleLogin = async () => {
    const user = await googleLogin();
    if (user) {
      console.log('Logged in user:', user);
      // Navigate to the main app screen or update UI as needed
    }
  };

  return <Button title="Sign in with Google" onPress={handleGoogleLogin} />;
};

export default GoogleLoginButton;
