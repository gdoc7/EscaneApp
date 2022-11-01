import React from "react";
import { StyleSheet, Text, View } from "react-native";

const Receipt = ({ data }) => {
  const parseRecipt = (data) => {
    let aux = [];
    Object.keys(data).map(() => {
      return aux.push({
        comercio: data["merchant"],
        nif: data["nif"],
        ivaPercent: data["ivaPercent"],
        amount: data["amount"],
        iva: data["iva"],
        productos: data["rows"],
        total: data["total"],
      });
    });
    return aux[0];
  };
  return (
    <View
      style={{
        borderStyle: "solid",
        borderWidth: 1,
        padding: 45,
        borderColor: "#bab5b5",
        minWidth: "80%",
      }}
    >
      {data
        ? Object.keys(parseRecipt(data)).map((key, index) => {
       
            return (
              <View key={index}>
                {key === "comercio" ? (
                  <Text
                    style={{
                      fontSize: 15,
                      paddingBottom: 25,
                      fontWeight: "bold",
                    }}
                  >
                    {data[key] ? data[key] : "Comercio"}
                  </Text>
                ) : (
                  <>
                    {key === "total" ? (
                      <View
                        style={{
                          borderBottomColor: "black",
                          borderTopColor: "black",
                          borderTopWidth: 3,
                          borderBottomWidth: 3,
                          marginVertical: 10,
                        }}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 15,
                              paddingVertical: 15,
                              fontWeight: "bold",
                            }}
                          >
                            {key}
                          </Text>

                          <Text
                            style={{
                              fontSize: 15,
                              paddingVertical: 15,
                            }}
                          >
                            {data[key]}
                          </Text>
                        </View>
                      </View>
                    ) : (
                      <View
                        style={{
                          flexDirection: key === "productos" ? "column" : "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 15,
                            paddingVertical: 15,
                            fontWeight: "bold",
                          }}
                        >
                          {key}
                        </Text>

                        <Text
                          style={{
                            fontSize: 15,
                            paddingVertical: 15,
                          }}
                        >
                          {key === "productos" && data['rows']? data['rows'][0] : data[key]}
                        </Text>
                      </View>
                    )}

                    <View
                      style={{
                        borderBottomColor: "black",
                        borderBottomWidth: StyleSheet.hairlineWidth,
                      }}
                    />
                  </>
                )}
              </View>
            );
          })
        : null}
    </View>
  );
};

export default Receipt;
