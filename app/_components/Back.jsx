import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function Back() {
    const navigation = useNavigation();

    const handleGoBack = () => {
        if (navigation.canGoBack()) {
            navigation.goBack();
        } else {
            navigation.navigate('HomePage');
        }
    };
    return (
        <Ionicons
            name="chevron-back-outline"
            size={32}
            color="#fff"
            onPress={handleGoBack}
            style={{
                position: "absolute",
                top: 60,
                left: 20
            }}
        />
    )
}