import LocationInputs from "@/components/LocationInputs";
import LocationList from "@/components/LocationList";
import ModeOfTrasportSelect from "@/components/ModeOfTransportSelect";
import { StyleSheet, View } from "react-native";

function RouteSelect () {
    return (
        <View style={styles.container}>
            <LocationInputs />
            <View style={styles.transportMode}>
                <ModeOfTrasportSelect />
            </View>
            <View style={styles.line}></View>
            <LocationList />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
        paddingHorizontal: 16
    },
    transportMode: {
        paddingVertical: 12,
    },
    line: {
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        marginTop: 8,
        marginBottom: 12
    }
})


export default RouteSelect;