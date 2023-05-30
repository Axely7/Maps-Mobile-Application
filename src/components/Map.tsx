import React, {useEffect, useRef} from 'react';
import MapView, {Marker, Polyline} from 'react-native-maps';
import {useLocation} from '../hooks/useLocation';
import {LoadingScreen} from '../pages/LoadingScreen';
import {Fab} from './Fab';

interface Props {
  markers?: Marker[];
}

export const Map = ({markers}: Props) => {
  const {
    initialPosition,
    hasLocation,
    userLocation,
    routeLines,
    getCurrentLocation,
    followUserLocation,
    stopFollowUserLocation,
  } = useLocation();

  const mapViewRef = useRef<MapView>();
  const following = useRef(true);

  useEffect(() => {
    followUserLocation();

    return () => {
      stopFollowUserLocation();
    };
  }, []);

  useEffect(() => {
    if (!following.current) return;

    const {longitude, latitude} = userLocation;

    mapViewRef.current?.animateCamera({
      center: {latitude: latitude, longitude: longitude},
    });
  }, [userLocation]);

  const centerPosition = async () => {
    const location = await getCurrentLocation();
    following.current = true;
    mapViewRef.current?.animateCamera({
      center: {latitude: location.latitude, longitude: location.longitude},
    });
  };

  if (!hasLocation) {
    return <LoadingScreen />;
  }

  return (
    <>
      <MapView
        ref={el => (mapViewRef.current = el!)}
        style={{flex: 1}}
        // provider={PROVIDER_GOOGLE}
        showsUserLocation
        initialRegion={{
          latitude: initialPosition!.latitude,
          longitude: initialPosition!.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        onTouchStart={() => (following.current = false)}>
        {/* <Marker
          coordinate={{latitude: 37.78825, longitude: -122.4324}}
          title="Esto es un título"
          description="Description"
          image={require('../assets/custom-marker.png')}
        /> */}
        <Polyline
          coordinates={routeLines}
          strokeColor="black"
          strokeWidth={3}
        />
      </MapView>
      <Fab
        iconName="compass-outline"
        onPress={centerPosition}
        style={{position: 'absolute', bottom: 20, right: 20}}
      />
    </>
  );
};
