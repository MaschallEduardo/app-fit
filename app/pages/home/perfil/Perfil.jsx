import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    Alert,
    ActivityIndicator,
    StyleSheet,
    ScrollView
} from "react-native";
import { fetchPerfilUsuario } from "../../../scripts/perfil";
import ImagePerfil from "../../../_components/ImagePerfil";
import Back from "../../../_components/Back";
import Button from "../../../_components/Button"
import { useNavigation } from "@react-navigation/native";
import { fetchPublicacoesUsuario } from "../../../scripts/publicacao";
import PublicacoesPerfil from "../../../_components/PublicacoesPerfil";

export default function Perfil() {
    const [perfil, setPerfil] = useState(null)
    const [loading, setLoading] = useState(true)
    const navigation = useNavigation()
    const [publicacoes, setPublicacoes] = useState('')

    useEffect(() => {
        (async () => {
            try {
                const data = await fetchPerfilUsuario();
                setPerfil(data);
            } catch (e) {
                console.error(e);
                Alert.alert("Erro", e.message);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    useEffect(() => {
        (async () => {
            try {
                const list = await fetchPublicacoesUsuario();
                setPublicacoes(list);
            } catch (e) {
                console.error(e);
            } 
        })();
    }, []);

    console.log('publicacoes', publicacoes);


    if (loading) {
        return (
            <View style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#161819"
            }}>
                <ActivityIndicator size="large" color="#1DB954" />
            </View>
        );
    }

    if (!perfil) {
        return (
            <View style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#161819"
            }}>
                <Text style={{
                    color: "red"
                }}>Não foi possível carregar o perfil.</Text>
            </View>
        );
    }

    return (
        <View style={{
            flex: 1,
            alignItems: "center",
            paddingTop
                : 60,
        }}>
            <Back />

            <View style={{
                marginTop: 60
            }}>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 20
                }}>
                    <View>
                        <ImagePerfil size={80} />
                    </View>
                    <View>
                        <Text style={{ color: 'white', fontSize: 20, fontWeight: "bold" }}> {perfil.nome}</Text>
                        <Text style={{ color: '#bbb', fontSize: 14 }}> {perfil.cidade} - {perfil.estado}</Text>
                    </View>
                </View>

                <View style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: 10,
                    marginTop: 30
                }}>
                    <Button title="Editar perfil" variant="info" onPress={() => navigation.navigate('EditarPerfil')} />
                    <Button title="Criar atividade" onPress={() => navigation.navigate('NovaAtividade')} />
                </View>
            </View>

            <View style={{ flex: 1, display: 'flex', flexDirection: 'row' }}>
                <PublicacoesPerfil publicacoes={publicacoes} />
            </View>
        </View>
    );
}
