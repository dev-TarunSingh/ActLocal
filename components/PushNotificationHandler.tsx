import { useEffect, useRef, useContext } from "react";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import axios from "axios";
import { Platform, AppState } from "react-native";
import AuthContext from "@/contexts/AuthContext";
import { EventSubscription } from "expo-modules-core";
import { usePopup } from "@/contexts/PopupContext";
import { router } from "expo-router";
import socket from "@/socket";

export default function PushNotificationHandler() {
  const { userProfile } = useContext(AuthContext);
  const { showPopup } = usePopup();
  const notificationListener = useRef<EventSubscription | null>(null);
  const responseListener = useRef<EventSubscription | null>(null);
  const socketRef = useRef<any>(null);

  type MessagePayload = {
    senderName: string;
    text: string;
    chatroomId: string;
  };

  // 🔹 Define outside the hook
  const registerForPushNotificationsAsync = async () => {
    if (!userProfile?._id) return;

    if (!Device.isDevice) {
      alert("Must use physical device for Push Notifications");
      return;
    }

    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      console.warn("Notification permission not granted!");
      return;
    }

    try {
      const token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log("Expo push token:", token);

      await axios.post(
        "https://actlocal-server.onrender.com/api/user/save-token",
        {
          userId: userProfile._id,
          token,
        }
      );

      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#FF231F7C",
        });
      }
    } catch (err) {
      console.error("Error saving push token or setting channel", err);
    }
  };

  // 🔹 Setup socket
  useEffect(() => {
    if (!userProfile?._id) return;

    if (!socket.connected) {
      socket.io.opts.query = { userId: userProfile._id }; // set query dynamically
      socket.connect();
    }

    socket.on("connect", () => {
      console.log("Connected to socket server");
    });

    return () => {
      socket.off("newMessage"); // disconnect listener only, not socket
    };
  }, [userProfile?._id]);

  // 🔹 Call registration when AppState changes
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        registerForPushNotificationsAsync();
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  // 🔹 First time setup
  useEffect(() => {
    registerForPushNotificationsAsync();

    // Foreground
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log("Foreground notification:", notification);
      });

    // When tapped
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const chatroomId =
          response.notification.request.content.data?.chatroomId;
        if (chatroomId) {
          router.push({
            pathname: "/chat/[chatroomId]",
            params: { chatroomId },
          });
        } else {
          console.warn("chatroomId not found in notification data");
        }
      });

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, [userProfile?._id]);

  return null;
}
