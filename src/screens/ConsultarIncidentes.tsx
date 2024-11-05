import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

interface Incident {
  id: string;
  incidentId: string;
  description: string;
  category: string;
  priority: string;
  client: string;
  openingDate: string;
  closingDate: string;
  solution: string;
}

export default function IncidentDetailScreen() {
  const [incidentId, setIncidentId] = useState('');
  const [incident, setIncident] = useState<Incident | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSearch = () => {
    // Simulación de la consulta del incidente (puedes reemplazarlo con una llamada a la API)
    if (incidentId === 'A012M23415') {
      setIncident({
        id: '12345',
        incidentId: 'A012M23415',
        description: 'El usuario reporta que no puede iniciar sesión en el sistema. Al intentar ingresar sus credenciales, recibe un mensaje de error indicando que el nombre de usuario o la contraseña no son válidos.',
        category: 'Acceso',
        priority: 'Alta',
        client: 'Movistar Colombia',
        openingDate: '2024-09-12 8:30 am',
        closingDate: '2024-09-12 10:30 am',
        solution: 'Verificar credenciales del usuario: Solicita al usuario que revise cuidadosamente su nombre de usuario y contraseña para asegurarse de que están ingresados correctamente. Asegúrate de que el bloqueo de mayúsculas (Caps Lock) no esté activado. Restablecimiento de contraseña: Si el usuario no recuerda su contraseña o sigue recibiendo un mensaje de error, indícale que use la opción "¿Olvidaste tu contraseña?". Esto permitirá enviar un enlace de restablecimiento al correo electrónico registrado.',
      });
      setErrorMessage(null); // Limpiar mensaje de error
    } else {
      setIncident(null);
      setErrorMessage('Incidente no encontrado. Por favor, verifique el ID ingresado.');
    }

    // Limpiar el campo de entrada después de la búsqueda
    setIncidentId('');
  };

  return (
    <ScrollView style={styles.container}>
      {/* Buscador */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Icon name="search" size={20} color="#74777F" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="ID del incidente"
            value={incidentId}
            onChangeText={setIncidentId}
          />
          <TouchableOpacity onPress={handleSearch}>
            <Icon name="arrow-right" size={20} color="#74777F" style={styles.searchArrow} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Mensaje de error */}
      {errorMessage && (
        <Text style={styles.errorMessage}>{errorMessage}</Text>
      )}

      {/* Detalles del incidente */}
      {incident && (
        <View style={styles.incidentContainer}>
          <View style={styles.card}>
            <Text style={styles.label}>ID: {incident.id}</Text>
            <Text style={styles.description}>{incident.description}</Text>
          </View>

          <View style={styles.details}>
            <View style={styles.row}>
              <View style={styles.categoryContainer}>
                <Text style={styles.label}>Categoría: </Text>
                <Text style={styles.value}>{incident.category}</Text>
              </View>
              <View style={styles.priorityContainer}>
                <Text style={styles.label}>Prioridad: </Text>
                <Text
                  style={[
                    styles.priority,
                    incident.priority === 'Alta' ? styles.priorityHigh : styles.priorityLow,
                  ]}
                >
                  {incident.priority}
                </Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.label}>Cliente:</Text>
              <Text style={styles.value}>{incident.client}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.label}>Fecha de apertura:</Text>
              <Text style={styles.value}>{incident.openingDate}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.label}>Fecha de cierre:</Text>
              <Text style={styles.value}>{incident.closingDate}</Text>
            </View>
          </View>

          <Text style={styles.solutionTitle}>Solución</Text>
          <View style={styles.solutionCard}>
            <Text style={styles.solutionText}>{incident.solution}</Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF1F8',
    borderWidth: 1,
    borderColor: '#EFF1F8',
    borderRadius: 32,
    paddingHorizontal: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 8,
    paddingLeft: 8,
  },
  searchIcon: {
    marginLeft: 8,
  },
  searchArrow: {
    marginLeft: 8,
  },
  errorMessage: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  incidentContainer: {
    marginBottom: 16,
  },
  incidentId: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  card: {
    backgroundColor: '#f1f1f1',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  description: {
    color: '#555',
    marginTop: 8,
    fontSize: 14,
  },
  details: {
    marginBottom: 16,
    justifyContent: 'space-between',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 8,
  },
  priorityContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    flex: 1,
    marginHorizontal: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    marginHorizontal: 8,
  },
  priority: {
    fontWeight: 'normal',
    paddingVertical: 4,
    paddingHorizontal: 10,
    textAlign: 'center',
    borderRadius: 4,
    color: '#fff',
    marginLeft: 4,
  },
  priorityHigh: {
    backgroundColor: '#e74c3c',
  },
  priorityLow: {
    backgroundColor: '#3498db',
  },
  value: {
    fontSize: 16,
    textAlign: 'center',
  },
  solutionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    marginHorizontal: 8,
  },
  solutionCard: {
    backgroundColor: '#f1f1f1',
    padding: 16,
    borderRadius: 8,
  },
  solutionText: {
    color: '#555',
    fontSize: 14,
  },
});
