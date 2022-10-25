import axios from "axios";



export const receiptScan = async ({ imageBase64 }) => {
  
  try {
    const { data } = await axios.post("http://ec2-44-202-14-24.compute-1.amazonaws.com:8080/api/ReceiptScan/ReceiptScan", {
      image_id: 0,
      image: imageBase64,
    });
    return data;
  } catch (error) {
    console.log('Error', error);
  }
};
