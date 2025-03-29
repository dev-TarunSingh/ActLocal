import React, { useEffect } from 'react';
import * as Location from 'expo-location';

export const useLocation = () => {
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [longitude, setLongitude] = React.useState<number | null>(null);
  const [latitude, setLatitude] = React.useState<number | null>(null);
  const [PermissionGranted, setPermissionGranted] = React.useState(false);

  const getUserLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        setPermissionGranted(false);
        return;
      }

      setPermissionGranted(true);

      let location = await Location.getCurrentPositionAsync({});
      

      if (location.coords) {
        setLongitude(location.coords.longitude);
        setLatitude(location.coords.latitude);
      } else {
        setErrorMsg('Unable to fetch location coordinates');
      }
    } catch (error) {
      console.error('Error fetching location:', error);
      setErrorMsg('Error fetching location');
    }
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  return { errorMsg, longitude, latitude, getUserLocation, PermissionGranted };
};