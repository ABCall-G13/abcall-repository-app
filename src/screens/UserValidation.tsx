import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axiosInstance from '../config/ApiConfig';

const UserValidation = ({ navigation }: { navigation: any }) => {
  const [docType, setDocType] = useState('');
  const [docNumber, setDocNumber] = useState('');
  const [clientes, setClientes] = useState<{ id: string; nit: string; nombre: string }[]>([]);
  const [selectedClient, setSelectedClient] = useState<{ id: string; nit: string; nombre: string } | null>(null);

  useEffect(() => {
    // Obtener la lista de clientes
    axiosInstance.get('/clientes')
      .then((response) => setClientes(response.data))
      .catch((error) => console.error('Error al obtener los clientes:', error));
  }, []);

  const handleValidateUser = async () => {
    if (!docType || !docNumber || !selectedClient) {
      Alert.alert('Error', 'Por favor, completa todos los campos.');
      return;
    }

    try {
      const response = await axiosInstance.get('/usuario', {
        params: {
          doc_type: docType,
          doc_number: docNumber,
          client: selectedClient.nit,
        },
      });

      if (response.data && Object.keys(response.data).length > 0) {
        const userData = {
          cliente_id: selectedClient.id,
          identificacion_usuario: response.data.id,
        };

        // Navegar a CrearIncidente y pasar el id del cliente
        navigation.navigate('CrearIncidente', { initialUserInfo: userData });
      } else {
        Alert.alert('Usuario no encontrado', 'No se encontraron datos para el usuario ingresado.');
      }
    } catch (error) {
      Alert.alert('Error', 'Hubo un problema al validar el usuario.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Tipo de documento</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={docType}
          onValueChange={(value) => setDocType(value)}
          style={styles.picker}
        >
          <Picker.Item label="Seleccione un tipo de documento" value="" />
          <Picker.Item label="Cédula de ciudadanía" value="CC" />
          <Picker.Item label="Pasaporte" value="PP" />
          <Picker.Item label="Cédula de extranjería" value="CE" />
          <Picker.Item label="NIT" value="NIT" />
        </Picker>
      </View>

      <Text style={styles.label}>Número de identificación</Text>
      <TextInput
        style={styles.input}
        placeholder="Ingrese el número de identificación"
        value={docNumber}
        onChangeText={setDocNumber}
      />

      <Text style={styles.label}>Cliente</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedClient ? JSON.stringify(selectedClient) : ''}
          onValueChange={(value) => setSelectedClient(value ? JSON.parse(value) : null)}
          style={styles.picker}
        >
          <Picker.Item label="Seleccione un cliente" value="" />
          {clientes.map((cliente) => (
            <Picker.Item key={cliente.nit} label={cliente.nombre} value={JSON.stringify(cliente)} />
          ))}
        </Picker>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleValidateUser}>
        <Text style={styles.buttonText}>VALIDAR USUARIO</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
    fontWeight: '500',
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    backgroundColor: '#fff',
    elevation: 2, // sombra en Android
    shadowColor: '#000', // sombra en iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  pickerContainer: {
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
    backgroundColor: '#fff',
    overflow: 'hidden',
    elevation: 2, // sombra en Android
    shadowColor: '#000', // sombra en iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  picker: {
    height: 50,
    color: '#333',
  },
  button: {
    backgroundColor: '#4a7dfc',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    elevation: 3, // sombra en Android
    shadowColor: '#4a7dfc', // sombra en iOS
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default UserValidation;
