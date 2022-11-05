import { Roboto_400Regular, Roboto_500Medium, Roboto_700Bold, useFonts } from "@expo-google-fonts/roboto"
import { NativeBaseProvider } from "native-base"
import { Loading } from "./src/components/Loading"
import { SignIn } from "./src/screens/SignIn"
import { THEME } from "./src/styles/theme"

export default function App() {
  const [fontsLoading] = useFonts({
    Roboto_400Regular,
    Roboto_500Medium,
    Roboto_700Bold
  })

  return (
    <NativeBaseProvider theme={THEME}>
      {
        fontsLoading ? <SignIn /> : <Loading />
      }
    </NativeBaseProvider>
  )


}
