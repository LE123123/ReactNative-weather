// // StatusBar는 third-party component이다.
// // StatusBar는 단지 베터리, 시간등을 표시해 주는 것이다.
// // 다시 말하지만 react-native는 브라우저가 아닌 단지 개발자들을 위한 인터페이스 일 뿐이다.
// import { StatusBar } from "expo-status-bar";
// import React from "react";
// import { StyleSheet, Text, View } from "react-native";
// // "react-native"에 StatusBar가 있고 "expo-status-bar"에 StatusBar가 있는 이유는
// // Expo가 React Native의 일부 Components와 APIs를 복제하고 개선하기를 결정했기 때문이다.

// // react-native 는 웹 사이트가 아니기 때문에 div와 같은걸 쓸 수 없다.

// // Views는 우리가 만들 모든 것을 볼 container이다.
// export default function App() {
//   return (
//     <View style={styles.container}>
//       <Text ext style={styles.text}>
//         Hello!!!!!!!!!
//       </Text>

//       <StatusBar style="auto" />
//     </View>
//   );
// }

// // StyleSheet.create는 자동완성 기능을 제공해 준다
// // 꼭 필요한 건 아니다 그냥 style안에다가 객체 형식으로 넣어줘도 된다.
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   text: {
//     fontSize: 28,
//     color: "red",
//   },
// });

// <Layout System>

// import React from "react";
// import { View } from "react-native";

// export default function App() {
//   return (
//     // View에게 우리는 flex-Container가 되라고 한 적이 없다.
//     // 여기서는 이미 Container View가 Flex Container이다.
//     // 또한 기본값은 모두 column이다. -> 웹에서는 row
//     // 또한 부모가 중요하게 되는데 flex: 1을 써주지 않으면 무엇의 1배인지 알 수가 없어서 표시되지 않는다.
//     <View style={{ flex: 1 }}>
//       <View style={{ flex: 1, backgroundColor: "tomato" }}></View>
//       <View style={{ flex: 1.5, backgroundColor: "teal" }}></View>
//       <View style={{ flex: 1, backgroundColor: "orange" }}></View>
//     </View>
//   );
// }

// 또한 우리는 너비와 높이에 기반하지 않을것이다.
// 우리는 수 많은 스크린에서 동일한 방식으로 보이는 레이아웃을 만드는 것에 대해 생각해 볼 필요가 있다.

// <style>

import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions, ActivityIndicator } from "react-native";
import Axios from "axios";
import { Fontisto } from "@expo/vector-icons";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const Map_API_KEY = "AIzaSyD_g6D8fSLxsD49de4VQqhwEbv5nhqYy4A";
const Weather_API_KEY = "fee409d65afd9f48ed99c27d9852e66d";

const icons = {
  Clouds: "cloudy",
  Clear: "day-sunny",
  Atmosphere: "cloudy-gusts",
  Snow: "snow",
  Rain: "rains",
  Drizzle: "rain",
  Thunderstorm: "lightning",
};

export default function App() {
  const [city, setCity] = useState("Loading...");
  const [days, setDays] = useState([]);
  const [ok, setOk] = useState(true);

  const getWeather = async () => {
    try {
      const { granted } = await Location.requestForegroundPermissionsAsync();
      if (!granted) {
        setOk(false);
      }
      const {
        coords: { latitude, longitude },
      } = await Location.getCurrentPositionAsync({ accuracy: 5 });
      Location.setGoogleApiKey(Map_API_KEY);
      const geoLocation = await Location.reverseGeocodeAsync({ latitude, longitude }, { useGoogleMaps: false });
      setCity(geoLocation[0].region);
      const URL = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${Weather_API_KEY}&units=metric`;
      Axios.get(URL).then((response) => {
        console.log(response.data.daily);
        setDays(response.data.daily);
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getWeather();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      <ScrollView pagingEnabled horizontal indicatorStyle="white" contentContainerStyle={styles.weather}>
        {days.length === 0 ? (
          <View style={styles.day}>
            <ActivityIndicator color="white" size="large" style={{ marginTop: 10 }} />
          </View>
        ) : (
          days.map((day, index) => (
            <View key={index} style={styles.day}>
              <Text style={styles.date}>{new Date(day.dt * 1000).toString().substring(0, 10)}</Text>
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-end", width: "100%" }}>
                <Text style={styles.temp}>{parseFloat(day.temp.day).toFixed(1)}</Text>
                <Fontisto name={icons[day.weather[0].main]} size={68} color="white" />
              </View>
              <Text style={styles.description}>{day.weather[0].main}</Text>
              <Text style={styles.tinyText}>{day.weather[0].description}</Text>
            </View>
          ))
        )}
      </ScrollView>
      <View style={styles.container}>
        <Text></Text>
      </View>
    </View>
  );
}

// 우리는 사용자의 위치를 API를 이용하여 가져와야 한다.
// 또한 해당 위치를 API에 전송하고 날씨를 가져와야 한다.

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "tomato",
  },
  city: {
    flex: 1.2,
    justifyContent: "center",
    alignItems: "center",
  },
  cityName: {
    color: "black",
    fontSize: 68,
    fontWeight: "500",
  },
  weather: {},
  day: {
    width: SCREEN_WIDTH,
    alignItems: "center",
  },
  temp: {
    marginTop: 50,
    fontWeight: "600",
    fontSize: 168,
  },
  description: {
    marginTop: -30,
    fontSize: 60,
  },
  tinyText: {
    fontSize: 20,
  },
  date: {
    marginTop: 100,
    fontSize: 30,
  },
});

// export default function App() {
//   const [location, setLocation] = useState(null);
//   const [errorMsg, setErrorMsg] = useState(null);

//   useEffect(() => {
//     (async () => {
//       let { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== "granted") {
//         setErrorMsg("Permission to access location was denied");
//         return;
//       }

//       let location = await Location.getCurrentPositionAsync({});
//       setLocation(location);
//     })();
//   }, []);

//   let text = "Waiting..";
//   if (errorMsg) {
//     text = errorMsg;
//   } else if (location) {
//     text = JSON.stringify(location);
//   }

//   return (
//     <View style={styles.container}>
//       <Text style={styles.paragraph}>{text}</Text>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {},
//   paragraph: {},
// });
