import { ActivityIndicator, Alert, Image, Text, View } from "react-native";
import Back from "../../../_components/Back";
import Input from "../../../_components/Input";
import Button from "../../../_components/Button";
import { useEffect, useState } from "react";
import { fetchPerfilUsuario } from "../../../scripts/perfil";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { adicionarImagemPublicacao, criarPublicacao } from "../../../scripts/publicacao";
import * as Location from 'expo-location';
import * as ImagePicker from "expo-image-picker";

export default function NovaAtividade() {
    const [titulo, setTitulo] = useState("");
    const [descricao, setDescricao] = useState("");
    const [tempo, setTempo] = useState("");
    const [intensidade, setIntensidade] = useState("");
    const [nome, setNome] = useState('')
    const [imagemUri, setImagemUri] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();
    const [saving, setSaving] = useState(false);
    const [localizacao, setLocalizacao] = useState('');

    useEffect(() => {
        (async () => {
            try {
                const data = await fetchPerfilUsuario();
                setNome(data.nome);
                if (data.imagemUri) {
                    setImagemUri(data.imagemUri);
                }
            } catch (e) {
                Alert.alert("Erro", e.message);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    useEffect(() => {
        (async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permissão negada');
                setLocalizacao('');
                return;
            }
            const loc = await Location.getCurrentPositionAsync();
            const rev = await Location.reverseGeocodeAsync(loc.coords);
            if (rev.length) {
                const { city, region } = rev[0];
                setLocalizacao(`${city} - ${region}`);
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

    async function handleSave() {
        setSaving(true);
        try {
            await criarPublicacao({ titulo, descricao, localizacao, tempo, intensidade, imagemUri });
            Alert.alert('Sucesso', 'Atividade criada!', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        } catch (e) {
            Alert.alert('Erro', e.message);
        } finally {
            setSaving(false);
        }
    }

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

    if (saving) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#1DB954" />
            </View>
        );
    }
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
                    marginTop: 20,
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
                    Nova Atividade
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
                            width: '100%',
                            height: 150,
                            borderRadius: 10,
                            backgroundColor: "#373B3D",
                            alignSelf: "center",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        {imagemUri ? (
                            <Image
                                source={{ uri: imagemUri }}
                                style={{
                                    width: '100%',
                                    height: 150,
                                    borderRadius: 10,
                                }}
                                resizeMode="cover"
                            />
                        ) : (
                            <Text style={{ color: "#bbb", fontSize: 24 }}>+</Text>
                        )}
                    </TouchableOpacity>

                    <Input
                        placeholder="Nome Atividade"
                        value={titulo}
                        onChangeText={setTitulo}
                    />
                    <Input
                        placeholder="Descrição"
                        value={descricao}
                        onChangeText={setDescricao}
                    />
                    <Input
                        placeholder="Intensidade"
                        value={intensidade}
                        onChangeText={setIntensidade}
                    />
                    <Input
                        placeholder="Tempo de atividade"
                        value={tempo}
                        onChangeText={setTempo}
                    />
                    <Button title="Salvar" onPress={handleSave} />
                </View>
            </View>
        </View>
    )
}