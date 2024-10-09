import { Alert } from "react-native";

export const alert = (title: string, message: string) => {
  return Alert.alert(title, message, [
    {
      text: "OK",
      onPress: () => {},
    },
  ]);
};
