import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import axiosInstance from '../config/ApiConfig';
import { Picker } from '@react-native-picker/picker';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';

type CrearIncidenteNavigationProp = StackNavigationProp<RootStackParamList, 'CrearIncidente'>;
type CrearIncidenteRouteProp = RouteProp<RootStackParamList, 'CrearIncidente'>;

interface CrearIncidenteProps {
  route: CrearIncidenteRouteProp;
  navigation: CrearIncidenteNavigationProp;
}

const CrearIncidente: React.FC<CrearIncidenteProps> = ({ route, navigation }) => {
  const { initialUserInfo } = route.params;

  const [formData, setFormData] = useState({
    descripcion: '',
    categoria: '',
    prioridad: '',
  });
  const [enums, setEnums] = useState({
    categoria: [],
    prioridad: [],
  });

  useEffect(() => {
    axiosInstance.get('/incidentes/fields')
      .then((response) => setEnums(response.data))
      .catch((error) => console.error('Error al obtener valores:', error));
  }, []);

  const handleChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    if (!initialUserInfo) {
      Alert.alert('Error', 'La información del usuario es requerida.');
      return;
    }

    const requestData = {
      description: formData.descripcion,
      categoria: formData.categoria,
      prioridad: formData.prioridad,
      canal: 'Aplicación',
      cliente_id: initialUserInfo.cliente_id,
      estado: 'abierto',
      fecha_creacion: new Date().toISOString().slice(0, 10),
      fecha_cierre: null,
      solucion: null,
      identificacion_usuario: initialUserInfo.identificacion_usuario,
    };

    try {
      await axiosInstance.post('/incidente', requestData);
      Alert.alert('Éxito', 'Incidente creado satisfactoriamente.');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Hubo un problema al crear el incidente.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Descripción</Text>
      <TextInput
        style={styles.textArea}
        placeholder="Descripción del incidente"
        value={formData.descripcion}
        onChangeText={(value) => handleChange('descripcion', value)}
        multiline
        numberOfLines={4} // Ajusta la cantidad de líneas visibles inicialmente
      />

      <Text style={styles.label}>Categoría</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={formData.categoria}
          onValueChange={(value) => handleChange('categoria', value)}
          style={styles.picker}
        >
          <Picker.Item label="Selecciona una categoría" value="" />
          {enums.categoria.map((option, index) => (
            <Picker.Item key={index} label={option} value={option} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Prioridad</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={formData.prioridad}
          onValueChange={(value) => handleChange('prioridad', value)}
          style={styles.picker}
        >
          <Picker.Item label="Selecciona una prioridad" value="" />
          {enums.prioridad.map((option, index) => (
            <Picker.Item key={index} label={option} value={option} />
          ))}
        </Picker>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>REGISTRAR INCIDENTE</Text>
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
  textArea: {
    height: 200, // Altura de la caja de texto más grande
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    textAlignVertical: 'top', // Alinea el texto al principio de la caja
    backgroundColor: '#fff',
    marginBottom: 20,
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

export default CrearIncidente;
