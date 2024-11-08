import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

interface Incident {
  id: string;
  incidentId: string;
  description: string;
  categoria: string;
  prioridad: string;
  cliente_id: number;
  fecha_creacion: Date;
  fecha_cierre: Date;
  solucion: string;
  identificacion_usuario: string;
  radicado: string;
}

export default function IncidentDetailScreen() {
  const [incidentId, setIncidentId] = useState('');
  const [incident, setIncident] = useState<Incident | null>(null);
  const [clientName, setClientName] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSearch = async () => {
    try {
      // Llamada al endpoint de incidentes
      const incidentResponse = await fetch(`https://api-ddyhix7p4q-uc.a.run.app/incidente/radicado/${incidentId}`);
      if (incidentResponse.ok) {
        const incidentData: Incident = await incidentResponse.json();
        setIncident(incidentData);
        setErrorMessage(null);

        // Llamada al endpoint de clientes para obtener el nombre del cliente
        const clientsResponse = await fetch(`https://api-ddyhix7p4q-uc.a.run.app/clientes`);
        if (clientsResponse.ok) {
          const clientsData = await clientsResponse.json();
          const client = clientsData.find((c: { id: number }) => c.id === incidentData.cliente_id);
          setClientName(client ? client.nombre : 'Cliente no encontrado');
        } else {
          setClientName('Error al cargar el cliente');
        }
      } else {
        setIncident(null);
        setClientName(null);
        setErrorMessage('Incidente no encontrado. Por favor, verifique el ID ingresado.');
      }
    } catch (error) {
      console.error(error);
      setIncident(null);
      setClientName(null);
      setErrorMessage('Error al consultar el incidente. Intente nuevamente.');
    }

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
            <Icon name="arrow-right" size={20} color="#74777F"
            style={styles.searchArrow} testID="search_icon"/>
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
            <Text style={styles.label}>ID: {incident.radicado}</Text>
            <Text style={styles.description}>{incident.description}</Text>
          </View>

          <View style={styles.details}>
            <View style={styles.row}>
              <View style={styles.categoryContainer}>
                <Text style={styles.label}>Categoría: </Text>
                <Text style={styles.value}>
                  {incident.categoria ? incident.categoria.charAt(0).toUpperCase() + incident.categoria.slice(1) : 'Sin categoría'}
                </Text>
              </View>
              <View style={styles.priorityContainer}>
                <Text style={styles.label}>Prioridad: </Text>
                <Text
                  style={[
                    styles.priority,
                    incident.prioridad === 'alta' ? styles.priorityHigh : styles.priorityLow,
                  ]}
                >
                  {incident.prioridad ? incident.prioridad.charAt(0).toUpperCase() + incident.prioridad.slice(1) : 'Sin prioridad'}
                </Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.label}>Cliente:</Text>
              <Text style={styles.value}>{clientName || 'Cargando...'}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.label}>Fecha de apertura:</Text>
              <Text style={styles.value}>  {incident.fecha_creacion ? new Date(incident.fecha_creacion).toLocaleDateString('en-CA') : '--'}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.label}>Fecha de cierre:</Text>
              <Text style={styles.value}>{incident.fecha_cierre ? new Date(incident.fecha_cierre).toLocaleDateString('en-CA') : '--'}</Text>
            </View>
          </View>

          <Text style={styles.solutionTitle}>Solución</Text>
          <View style={styles.solutionCard}>
            <Text style={styles.solutionText}>
              {incident.solucion ? incident.solucion : 'Aún no se ha dado solución a este incidente'}
            </Text>
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
