// import SockJS from "sockjs-client";
// import { Client } from "@stomp/stompjs";

// let stompClient = null;

// export const connectWebSocket = (onMessageReceived) => {
//   const socket = new SockJS("http://localhost:8080/building_management/ws");

//   stompClient = new Client({
//     webSocketFactory: () => socket,
//     reconnectDelay: 5000,
//     onConnect: () => {
//       console.log("Connected to WebSocket");

//       stompClient.subscribe("/topic/bills", (message) => {
//         const data = JSON.parse(message.body);
//         onMessageReceived(data);
//       });
//     },
//   });

//   stompClient.activate();
// }