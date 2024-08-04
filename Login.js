import React, { useState } from "react";
import {
  Text,
  TextInput,
  View,
  Button,
  StyleSheet,
  Pressable,
  Alert,
  Image,
} from "react-native";
import { loginUser } from "./services/auth";

export default function Login(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const user = await loginUser(email, password);
      if (user && user.status === "active") {
        if (user.role === "app-admin") {
          Alert.alert("Login Successful", `Welcome, ${user.fullname}!`);
          // props.setEmail(email);
          props.setEmail(email.toLowerCase());

          props.setAuth(true);

          //   navigation.navigate('AdminDashboard'); // Example of navigation based on role
        } else {
          Alert.alert(
            "Login Successful",
            `Welcome, ${user.fullname}, but you are not Authorized, Call the Administrator`
          );

          //   navigation.navigate('UserDashboard'); // Example of navigation based on role
        }
      } else {
        alert("Invalid login credentials or inactive user");
      }
    } catch (err) {
      alert("An error occurred during login. Please try again.");
    }
  };

  const handleContactAdmin = () => {
    Alert.alert("Contact Admin", "Please call your Company's Customer Care");
  };

  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: "https://silotosidewalks.com/app/images/420.gif",
        }}
        style={styles.gif}
      />

      <View style={styles.headingDiv}>
        <Text style={styles.mainHeading}>Inventory App</Text>
        <Text style={styles.mainHeading}>by</Text>
        <Text style={styles.mainHeading}>Silo Soft</Text>
      </View>

      <View>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <Pressable style={styles.button} onPress={handleLogin}>
          <Text style={styles.textColor}>Log In</Text>
        </Pressable>
        <View style={styles.spacing} />
        <Button title="Contact Admin" onPress={handleContactAdmin} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    backgroundColor: "lightgreen",
    padding: 16,
    shadowColor: "black",
    shadowOffset: { width: 10, height: 10 },
    shadowOpacity: 0.7,
    shadowRadius: 3.84,
    elevation: 50, // For Android
  },
  headingDiv: {
    paddingVertical: 10,
    paddingTop: 50,
  },
  mainHeading: {
    marginTop: 0,
    fontSize: 40,
    textAlign: "center",
    fontWeight: "bold",
    fontVariant: "small-caps",
    margin: 0,
    padding: 0,
  },
  textColor: {
    color: "white",
  },

  scanButton: {
    position: "absolute",
    bottom: 10,
    justifyContent: "center",
    borderRadius: 25,
    padding: 5,
    width: 390,
    flexDirection: "row",
    gap: 10,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: "black",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  spacing: {
    height: 10,
  },
  gif: {
    marginTop: 50,
    width: 320,
    height: 200,
    marginBottom: 0,
  },
});
