import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Text, View } from "react-native";

export default function Sidebar(rota) {
    const navigation = useNavigation()
    const showSidebar =
        rota.rota !== "Login" &&
        rota.rota !== "Cadastrar" &&
        rota.rota !== "RecuperarSenha" &&
        rota.rota !== "NovaAtividade";

    if (!showSidebar) return null

    return (
        <>
            {rota.rota !== "Login" || rota.rota !== "Cadastrar" || rota.rota !== "RecuperarSenha" || rota.rota !== "NovaAtividade" ? (
                <View style={{
                    backgroundColor: "#373B3D",
                    width: '45%',
                    marginTop: 80,
                    padding: 15,
                    borderRadius: 12,
                    display: 'flex',
                    flexDirection: "row",
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 45
                }}>
                    <Ionicons
                        name="planet-outline"
                        size={32}
                        color={rota.rota === "HomePage" ? "#fff" : "#bbb"}
                        onPress={() => navigation.navigate('HomePage')}
                    />
                    <Ionicons
                        name="person-outline"
                        size={32}
                       color={rota.rota === "Perfil" ? "#fff" : "#bbb"}
                       onPress={() => navigation.navigate('Perfil')}
                    />
                </View>
            ) : null}
        </>
    )
}