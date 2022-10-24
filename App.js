// import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, View, Image } from "react-native";
import { Camera, CameraType } from "expo-camera";
import Button from "./src/components/Button";

export default function App() {
  const [hasCameraPermission, sethasCameraPermission] = useState(null);
  const [image, setimage] = useState(null);
  const [type, settype] = useState(CameraType.back);
  const [Flash, setFlash] = useState(Camera.Constants.FlashMode.off);
  const cameraRef = useRef(null);

  const takePicture = async () => {
    if (cameraRef) {
      try {
        const data = await cameraRef.current.takePictureAsync();
        console.log(data);
        setimage(data.uri);
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      sethasCameraPermission(cameraStatus.status === "granted");
    })();
  }, []);

  if (hasCameraPermission === false) {
    return <Text>No tiene permisos </Text>;
  }

  return (
    <View style={styles.container}>
      {!image ? (
        <Camera
          style={styles.camera}
          type={type}
          flashMode={Flash}
          ref={cameraRef}
        >
          <View style={styles.topButtonsContainer}>
            <Button icon={'flash'} color={Flash === Camera.Constants.FlashMode.off ? '#f1f1f1': 'yellow'} 
              onPress={() => {
              setFlash(Flash === Camera.Constants.FlashMode.off ? Camera.Constants.FlashMode.on :  Camera.Constants.FlashMode.off)
           
              console.log("flash ", Flash);

            }}/>

          </View>
        </Camera>
      ) : (
        <Image source={{ uri: image }} style={styles.camera} />
      )}
      <View>
        {image ? (
          <View style={styles.buttonsContainer}>
            <Button
              title={"Tomar otra"}
              icon="retweet"
              onPress={() => setimage(null)}
            />
            <Button title={"Guardar"} icon="check" />
          </View>
        ) : (
          <Button
            title={"Tomar foto"}
            icon="camera"
            onPress={takePicture}
          ></Button>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    paddingBottom: 20,
    justifyContent: "center",
  },
  camera: {
    flex: 1,
  },
  buttonsContainer: {
    flexDirection: "row",
    // justifyContent:'space-between',
    justifyContent: "space-between",
    paddingHorizontal: 50,
  },
  topButtonsContainer:{
    flexDirection:'row',
    justifyContent:'end',
    padding:45
  }
});
