import React from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";
import { Entypo } from "@expo/vector-icons";

const Button = ({ title, onPress, icon, color, sizeIcon, colorText }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.button}>
      <Entypo
        name={icon}
        size={sizeIcon ? sizeIcon : 28}
        color={color ? color : "#f1f1f1"}
      />
      <Text
        style={{
          fontWeight: "bold",
          fontSize: 16,
          color: colorText? colorText : "#f1f1f1",
          marginLeft: 10,
        }}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({
  button: {
    height: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {},
});
