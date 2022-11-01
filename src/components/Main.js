import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  Image,
  Text,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Camera, CameraType } from "expo-camera";
import Button from "./Button";
import { receiptScan } from "../services/reciptServices";
import { useMutation } from "@tanstack/react-query";
import Receipt from "./Receipt";

const Main = () => {
  const [hasCameraPermission, sethasCameraPermission] =
    Camera.useCameraPermissions();
  const [image, setimage] = useState(null);
  const [image64, setimage64] = useState(null);
  const [type, settype] = useState(CameraType.back);
  const [Flash, setFlash] = useState(Camera.Constants.FlashMode.off);
  const cameraRef = useRef(null);
  const [showJSON, setshowJSON] = useState(false);

  const { mutate, data, isLoading, status, reset } = useMutation(
    ["receipt-scan"],
    receiptScan
  );

  console.log("Status peticion:", status);

  const saveBase64 = () => {
    mutate({ imageBase64: image64 });
  };

  const takePicture = async () => {
    if (cameraRef) {
      try {
        const data = await cameraRef.current.takePictureAsync({ base64: true });
        setimage(data.uri);
        setimage64(data.base64);
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

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <Text style={{ fontWeight: "bold", fontSize: 40 , paddingBottom: 20}}>Escaneando...</Text>
        <ActivityIndicator size="large" color="blue" />
      </View>
    );
  }

  if (status === "success" && image64) {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ alignItems: "center", paddingTop: 55 }}>
          <Text
            style={{
              fontSize: 25,
              paddingBottom: 25,
              fontWeight: "bold",
            }}
          >
            Tu Factura
          </Text>
        </View>
        <View style={styles.response}>
          {!showJSON ? (
            <View>
              <Receipt data={data} />
              <Button
                title={"Mostrar en formato JSON"}
                icon="code"
                color="black"
                colorText="black"
                onPress={() => {
                  setshowJSON(true);
                }}
              />
            </View>
          ) : (
            <View>
              <Text> {JSON.stringify(data, null, 2)}</Text>
              <Button
                title={"Mostrar factura"}
                icon="back"
                color="black"
                colorText="black"
                onPress={() => {
                  setshowJSON(false);
                }}
              />
            </View>
          )}

          <View
            style={{
              position: "absolute",
              bottom: 0,
              paddingVertical: 20,
              backgroundColor: "#5477eb",
              width: "100%",
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              onPress={() => {
                setimage(null);
                setimage64(null);
                reset();
              }}
            >
              <Text
                style={{
                  fontSize: 25,
                  paddingVertical: 15,
                  fontWeight: "bold",
                  color: "white",
                }}
              >
                Volver a escanear
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
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
            <Button
              icon={"flash"}
              color={
                Flash === Camera.Constants.FlashMode.off ? "#f1f1f1" : "yellow"
              }
              onPress={() => {
                setFlash(
                  Flash === Camera.Constants.FlashMode.off
                    ? Camera.Constants.FlashMode.on
                    : Camera.Constants.FlashMode.off
                );

                console.log("flash ", Flash);
              }}
            />
          </View>
        </Camera>
      ) : (
        <Image source={{ uri: image }} style={styles.camera} />
      )}
      <View>
        {image64 ? (
          <View style={styles.buttonsContainer}>
            <Button
              title={"Tomar otra"}
              icon="retweet"
              onPress={() => {
                setimage(null);
                setimage64(null);
              }}
            />
            <Button title={"Escanear"} icon="check" onPress={saveBase64} />
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
};

export default Main;

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
    justifyContent: "space-between",
    justifyContent: "space-between",
    paddingHorizontal: 50,
  },
  topButtonsContainer: {
    flexDirection: "row",
    padding: 45,
  },
  loading: {
    flex: 1,
   
    alignItems: "center",
    justifyContent: "center",
  },
  response: {
    flex: 1,
    alignItems: "center",
    paddingTop: 55,
  },
});
