import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Text,
  View,
  Image,
  TouchableOpacity,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import Back from "../../../_components/Back";
import Input from "../../../_components/Input";
import Button from "../../../_components/Button";
import {
  fetchPerfilUsuario,
  updatePerfilUsuario,
} from "../../../scripts/perfil";

export default function EditarPerfil() {
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [imagemUri, setImagemUri] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchPerfilUsuario();
        console.log("Data", data.fotoPerfil);
        
        setNome(data.nome);
        setTelefone(data.telefone);
        if (data.imagemUri) {
          setImagemUri(data.fotoPerfil);
        }
      } catch (e) {
        Alert.alert("Erro", e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);
  
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permissão negada", "Precisamos de acesso às fotos.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      aspect: [1, 1],
    });

    console.log("Resultado da galeria:", result);

    const didCancel =
      typeof result.canceled === "boolean"
        ? result.canceled
        : result.cancelled;

    if (!didCancel) {
      let uri = result.assets && result.assets.length > 0
        ? result.assets[0].uri
        : result.uri;
      console.log("URI selecionada na galeria:", uri);
      setImagemUri(uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permissão negada", "Precisamos de acesso à câmera.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.7,
      aspect: [1, 1],
    });

    console.log("Resultado da câmera:", result);

    const didCancel =
      typeof result.canceled === "boolean"
        ? result.canceled
        : result.cancelled;

    if (!didCancel) {
      let uri = result.assets && result.assets.length > 0
        ? result.assets[0].uri
        : result.uri;
      console.log("URI capturada na câmera:", uri);
      setImagemUri(uri);
    }
  };

  const chooseImageSource = () => {
    Alert.alert("Foto de perfil", "Selecione a origem:", [
      { text: "Câmera", onPress: takePhoto },
      { text: "Galeria", onPress: pickImage },
      { text: "Cancelar", style: "cancel" },
    ]);
  };

 const handleSave = async () => {
    if (!nome || !telefone) {
      Alert.alert("Erro", "Preencha ambos os campos.");
      return;
    }
    setLoading(true);
    try {
      await updatePerfilUsuario({ nome, telefone, imagemUri });
      Alert.alert("Sucesso", "Perfil atualizado!", [
        { text: "OK", onPress: () => navigation.goBack() }
      ]);
    } catch (e) {
      Alert.alert("Erro", e.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#161819",
        }}
      >
        <ActivityIndicator size="large" color="#1DB954" />
      </View>
    );
  }

  console.log("imagemUri", imagemUri);
  

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        paddingTop: 60,
        justifyContent: "center",
      }}
    >
      <Back />

      <View
        style={{
          marginTop: 60,
          width: "100%",
          paddingLeft: 20,
          paddingRight: 20,
        }}
      >
        <Text
          style={{
            color: "white",
            fontSize: 40,
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          Editar perfil
        </Text>
        <View
          style={{
            marginTop: 30,
            gap: 20,
          }}
        >
          <TouchableOpacity
            onPress={chooseImageSource}
            style={{
              width: 120,
              height: 120,
              borderRadius: 60,
              backgroundColor: "#373B3D",
              alignSelf: "center",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {imagemUri ? (
              <Image
                source={{ uri: imagemUri }}
                style={{ width: 120, height: 120,  borderRadius: 60 }}
                resizeMode="cover"  
              />
            ) : (
              <Text style={{ color: "#bbb", fontSize: 24 }}>+</Text>
            )}
          </TouchableOpacity>

          <Input
            placeholder="Nome"
            value={nome}
            onChangeText={setNome}
          />
          <Input
            placeholder="Telefone"
            value={telefone}
            onChangeText={setTelefone}
          />
          <Button title="Salvar" onPress={handleSave} />
        </View>
      </View>
    </View>
  );
}
