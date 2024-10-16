import React from 'react';
import { Button } from 'react-native';
import { useUserViewModel } from '../viewmodels/UserViewModel';

const LogoutButton = () => {
  const { googleLogout } = useUserViewModel();

  const handleLogout = async () => {
    await googleLogout();
    // Navigate to the login screen or update UI as needed
  };

  return <Button title="Logout" onPress={handleLogout} />;
};

export default LogoutButton;
