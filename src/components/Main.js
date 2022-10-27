import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, View, Image, Text } from "react-native";
import { Camera, CameraType } from "expo-camera";
import Button from "./Button";
import { receiptScan } from "../services/reciptServices";
import { useMutation } from "@tanstack/react-query";

const Main = () => {
  const [hasCameraPermission, sethasCameraPermission] = useState(null);
  const [image, setimage] = useState(null);
  const [image64, setimage64] = useState(null);
  const [type, settype] = useState(CameraType.back);
  const [Flash, setFlash] = useState(Camera.Constants.FlashMode.off);
  const cameraRef = useRef(null);

  const parseRecipt = (data) => {
    let aux = [];
    Object.keys(data).map(() => {
      return aux.push({
        merchant: data["merchant"],
        nif: data["nif"],
        ivaPercent: data["ivaPercent"],
        total: data["total"],
        amount: data["amount"],
        iva: data["iva"],
        rows: data["rows"],
      });
    });
    return aux[0];
  };

  const { mutate, data, isLoading, status, reset } = useMutation(
    ["receipt-scan"],
    receiptScan,
    {
      onSuccess: () => {
        console.log(
          " Respuesta de servicio : ",
          data ? parseRecipt(data) : data
        );
      },
    }
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
    return <Text style={styles.loading}>Escaneando...</Text>;
  }
  if (status === "success" && image64) {
    return (
      <View style={styles.response}>
        {data
          ? Object.keys(parseRecipt(data)).map((key, index) => {
              return (
                <Text
                  key={index}
                  style={{
                    fontSize: 25,
                    fontWeight: "bold",
                    paddingBottom: 15,
                  }}
                >
                  {key}: {data[key]}{" "}
                </Text>
              );
            })
          : null}

        <Button
          icon="retweet"
          color="#00f"
          sizeIcon={35}
          onPress={() => {
            setimage(null);
            setimage64(null);
            reset();
          }}
        />
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
    justifyContent: "end",
    padding: 45,
  },
  loading: {
    flex: 1,
    paddingTop: 250,
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    fontSize: 50,
  },
  response: {
    flex: 1,

    alignItems: "center",
    justifyContent: "center",
  },
});
