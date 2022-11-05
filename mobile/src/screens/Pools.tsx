import { Octicons } from "@expo/vector-icons";
import { Icon, VStack } from "native-base";
import { Button } from "../components/Button";
import { Header } from "../components/Header";


export function Pools() {
  return (
    <VStack bg="gray.900" flex={1}>
      <Header title="Meus bolões" />

      <VStack mt={6} borderBottomWidth={1} borderBottomColor="gray.600" pb={4} mb={4}>
        <Button title="BUSCAR BOLÃO POR CÓDIGO" leftIcon={<Icon as={Octicons} name="search" color="black" size="mb" />} />
      </VStack>
    </VStack>
  )
}