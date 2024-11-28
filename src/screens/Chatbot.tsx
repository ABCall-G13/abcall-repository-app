import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  Image,
} from 'react-native';
import axiosInstance from '../config/ApiConfig';

interface Cliente {
  id: string;
  nit: string;
  nombre: string;
}

interface Message {
  sender: 'user' | 'bot';
  text: string | JSX.Element;
  timestamp: string;
}

const Chatbot = ({ navigation }: { navigation: any }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'bot',
      text: (
        <Text>
          ¡Hola! Soy tu asistente virtual.{'\n'}
          Por favor, ingresa tu tipo de documento.{'\n'}
          Las opciones son:{'\n'}
          <Text style={styles.boldText}>- CC:</Text> Cédula de ciudadanía{'\n'}
          <Text style={styles.boldText}>- PP:</Text> Pasaporte{'\n'}
          <Text style={styles.boldText}>- CE:</Text> Cédula de extranjería{'\n'}
          <Text style={styles.boldText}>- NIT:</Text> Número de Identificación Tributaria
        </Text>
      ),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [userInput, setUserInput] = useState('');
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [docType, setDocType] = useState('');
  const [docNumber, setDocNumber] = useState('');
  const [selectedClient, setSelectedClient] = useState<Cliente | null>(null);
  const [isAskingProblem, setIsAskingProblem] = useState(false);
  const [isRegisteringIncident, setIsRegisteringIncident] = useState(false);
  const [isRetryOrExit, setIsRetryOrExit] = useState(false);
  const [isSolvedOrNot, setIsSolvedOrNot] = useState(false);

  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    axiosInstance
      .get('/clientes')
      .then((response) => setClientes(response.data))
      .catch((error) => console.error('Error al obtener los clientes:', error));
  }, []);

  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const resetBot = () => {
    setMessages([
      {
        sender: 'bot',
        text: (
          <Text>
            ¡Hola! Soy tu asistente virtual.{'\n'}
            Por favor, ingresa tu tipo de documento.{'\n'}
            Las opciones son:{'\n'}
            <Text style={styles.boldText}>- CC:</Text> Cédula de ciudadanía{'\n'}
            <Text style={styles.boldText}>- PP:</Text> Pasaporte{'\n'}
            <Text style={styles.boldText}>- CE:</Text> Cédula de extranjería{'\n'}
            <Text style={styles.boldText}>- NIT:</Text> Número de Identificación Tributaria
          </Text>
        ),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setDocType('');
    setDocNumber('');
    setSelectedClient(null);
    setUserInput('');
    setIsAskingProblem(false);
    setIsRetryOrExit(false);
  };

  const handleSendMessage = async () => {
    if (userInput.trim() === '') {
      return;
    }

    const newMessages: Message[] = [
      ...messages,
      { sender: 'user', text: userInput, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
    ];
    setMessages(newMessages);
    const userResponse = userInput.trim().toLowerCase();
    setUserInput('');

    if (isRetryOrExit) {
      if (userResponse === '1') {
        resetBot();
        return;
      } else if (userResponse === '2') {
        navigation.navigate('Home');
        return;
      } else {
        setMessages([
          ...newMessages,
          {
            sender: 'bot',
            text: 'Opción no válida. Por favor, escribe "1" para volver a intentar o "2" para salir.',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
        return;
      }
    }
    if (isSolvedOrNot) {
      console.log('isSolvedOrNot', userResponse);
      if (userResponse === '1') {
        setMessages([
          ...newMessages,
          {
            sender: 'bot',
            text: <Text>¡Qué gusto haber podido ayudarte! Si tienes algún otro problema, no dudes en contactarnos. {'\n'}
            <Text style={styles.boldText}>1.</Text> Volver a iniciar {'\n'}
            <Text style={styles.boldText}>2.</Text> Salir {'\n'}</Text>,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
        setIsRetryOrExit(true);
        setIsSolvedOrNot(false);
        return;
      } else if (userResponse === '2') {
        setMessages([
          ...newMessages,
          {
            sender: 'bot',
            text: 'Entendido, procederemos a registrar un incidente para que soporte pueda atender tu caso.',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
          {
            sender: 'bot',
            text: 'Por favor, proporciona más detalles sobre tu problema para registrar el incidente.',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
        setIsSolvedOrNot(false);
        setIsRegisteringIncident(true);
        setIsAskingProblem(true);
        setIsRetryOrExit(false);
        return;
      } else {
        setMessages([
          ...newMessages,
          {
            sender: 'bot',
            text: 'Opción no válida. Por favor, escribe "1" para Sí o "2" para No.',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
        return;
      }
    }
    if (isAskingProblem) {
      if (isRegisteringIncident) {
        // Lógica para registrar el incidente
        try {
          const searchResponse = await axiosInstance.post('/search-issues', { query: userInput });
          const solutions = searchResponse.data || [];
          const categoria = solutions[0]?.categoria || 'general'; // Fallback a 'general'
          const prioridad = solutions[0]?.prioridad || 'media'; // Fallback a 'media'
    
          const incidentPayload = {
            description: userInput,
            categoria,
            prioridad,
            canal: 'aplicación',
            cliente_id: selectedClient?.id,
            estado: 'abierto',
            fecha_creacion: new Date().toISOString().split('T')[0], // Fecha actual en formato YYYY-MM-DD
          };
    
          await axiosInstance.post('/incidente/', incidentPayload);
    
          // Confirmar registro al cliente
          setMessages([
            ...newMessages,
            {
              sender: 'bot',
              text: 'El incidente ha sido registrado exitosamente. Nuestro equipo de soporte se pondrá en contacto contigo pronto.',
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            },
            {
              sender: 'bot',
              text: '¿Hay algo más en lo que pueda ayudarte? Escribe "1" para volver a iniciar o "2" para salir.',
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            },
          ]);
          setIsRetryOrExit(true);
          setIsRegisteringIncident(false);
        } catch (error) {
          console.error('Error al registrar el incidente:', error);
          setMessages([
            ...newMessages,
            {
              sender: 'bot',
              text: 'Hubo un error al registrar el incidente. Por favor, intenta nuevamente más tarde.',
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            },
          ]);
        }
        return;
      }
      try {
        const response = await axiosInstance.post('/search-issues', { query: userInput });
        const solutions = response.data || [];
        if (solutions.length > 0) {
          const solutionsText = solutions
            .slice(0, 2)
            .map((solution: { solucion: string }, index: number) => `${index + 1}. ${solution.solucion}`)
            .join('\n');
          const chatGptResponse = await axiosInstance.post('/generate-response', {
            query: `Explica estas soluciones de forma detallada y útil para un cliente: \n${solutionsText}`,
          });
          console.log('chatGptResponse', chatGptResponse.data);
          const improvedSolutions = chatGptResponse.data.response;
          setMessages([
            ...newMessages,
            {
              sender: 'bot',
              text: `Estas son algunas soluciones detalladas:\n${improvedSolutions}`,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            },
            {
              sender: 'bot',
              text: '¿Alguna de estas opciones es útil para ti? Escribe "1" para Sí o "2" para No.',
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            },
          ]);
          setIsSolvedOrNot(true);
        } else {
          setMessages([
            ...newMessages,
            {
              sender: 'bot',
              text: 'No se encontraron soluciones para tu problema. Por favor, contacta a soporte.',
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            },
          ]);
        }
      } catch (error) {
        console.error('Error buscando soluciones:', error);
        setMessages([
          ...newMessages,
          {
            sender: 'bot',
            text: 'Hubo un error al buscar soluciones. Inténtalo más tarde.',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      }
      return;
    }

    if (!docType) {
      const validDocTypes = ['cc', 'pp', 'ce', 'nit'];
      if (!validDocTypes.includes(userResponse)) {
        setMessages([
          ...newMessages,
          {
            sender: 'bot',
            text: (
              <Text>
                Tipo de documento no válido. Por favor, ingresa uno de los siguientes:{'\n'}
                <Text style={styles.boldText}>- CC:</Text> Cédula de ciudadanía{'\n'}
                <Text style={styles.boldText}>- PP:</Text> Pasaporte{'\n'}
                <Text style={styles.boldText}>- CE:</Text> Cédula de extranjería{'\n'}
                <Text style={styles.boldText}>- NIT:</Text> Número de Identificación Tributaria
              </Text>
            ),
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
        return;
      }
      setDocType(userResponse.toUpperCase());
      setMessages([
        ...newMessages,
        { sender: 'bot', text: 'Por favor, ingresa tu número de identificación.', timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
      ]);
      return;
    }

    if (!docNumber) {
      if (isNaN(Number(userResponse))) {
        setMessages([
          ...newMessages,
          {
            sender: 'bot',
            text: 'El número de identificación debe ser un valor numérico. Inténtalo de nuevo.',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
        return;
      }
      setDocNumber(userResponse);
      setMessages([
        ...newMessages,
        {
          sender: 'bot',
          text: (
            <Text>
              Selecciona el cliente asociado escribiendo el número correspondiente de la lista:{'\n'}
              {clientes.map((cliente, index) => (
                <Text key={cliente.id}>
                  <Text style={styles.boldText}>{index + 1}:</Text> {cliente.nombre}{'\n'}
                </Text>
              ))}
            </Text>
          ),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      return;
    }

    if (!selectedClient) {
      const clientIndex = parseInt(userResponse) - 1;
      if (isNaN(clientIndex) || clientIndex < 0 || clientIndex >= clientes.length) {
        setMessages([
          ...newMessages,
          {
            sender: 'bot',
            text: 'Número de cliente no válido. Por favor, selecciona un número de la lista.',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
        return;
      }
      setSelectedClient(clientes[clientIndex]);
      const clienteSeleccionado = clientes[clientIndex];

      try {
        // Validar usuario
        const userResponse = await axiosInstance.get('/usuario', {
          params: {
            doc_type: docType,
            doc_number: docNumber,
            client: clienteSeleccionado.nit,
          },
        });

        if (!userResponse.data) {
          setMessages([
            ...newMessages,
            {
              sender: 'bot',
              text: 'No se pudo validar al usuario. Por favor, intenta nuevamente.',
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            },
          ]);
          setIsRetryOrExit(true);
          return;
        }

        // Consultar datos del cliente
        console.log('clienteSeleccionado', clienteSeleccionado);
        const clienteResponse = await axiosInstance.get(`/clientes/${clienteSeleccionado.nit}`);
        console.log('clienteResponse', clienteResponse.data);
        const { plan } = clienteResponse.data;

        if (plan === 'empresario' || plan === 'empresario_plus') {
          setMessages([
            ...newMessages,
            {
              sender: 'bot',
              text: `Hola, ${userResponse.data.nombre}! Por favor, describe tu problema con ${clienteResponse.data.nombre}.`,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            },
          ]);
          setIsAskingProblem(true);
        } else {
          setMessages([
            ...newMessages,
            {
              sender: 'bot',
              text: `El cliente ${clienteSeleccionado.nombre} no presta servicio de atención por medio de este chatbot.`,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            },
          ]);
          setIsRetryOrExit(true);
        }
      } catch (error) {
        setMessages([
          ...newMessages,
          {
            sender: 'bot',
            text: (<Text>
              Hubo un error al procesar la autenticación. {'\n'} Escribe {'\n'}
              <Text style={styles.boldText}>1.</Text> para volver a intentar. {'\n'}
              <Text style={styles.boldText}>2.</Text> para salir. {'\n'}
              </Text>),
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
        setIsRetryOrExit(true);
      }
      return;
    }
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View
      style={[
        styles.messageContainer,
        item.sender === 'bot' ? styles.botContainer : styles.userContainer,
      ]}
    >
      {item.sender === 'bot' && (
        <Image
          source={require('../../assets/logo.png')}
          style={styles.botLogo}
        />
      )}
      <View
        style={[
          styles.message,
          item.sender === 'bot' ? styles.botMessage : styles.userMessage,
        ]}
      >
        <Text style={item.sender === 'bot' ? styles.botText : styles.userText}>
          {item.text}
        </Text>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 50}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.innerContainer}>
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(_, index) => index.toString()}
            contentContainerStyle={styles.messagesContainer}
            keyboardShouldPersistTaps="handled"
          />
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Escribe un mensaje..."
              value={userInput}
              onChangeText={setUserInput}
              returnKeyType="send"
            />
            <TouchableOpacity onPress={handleSendMessage}>
              <Image
                source={require('../../assets/send.png')}
                style={styles.sendButton}
              />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  boldText: {
    fontWeight: 'bold',
    color: '#2F54B2',
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  messagesContainer: {
    padding: 10,
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginVertical: 5,
  },
  botContainer: {
    alignSelf: 'flex-start',
  },
  userContainer: {
    alignSelf: 'flex-end',
    flexDirection: 'row-reverse',
  },
  botLogo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  message: {
    padding: 15,
    borderRadius: 22,
    maxWidth: '75%',
  },
  botMessage: {
    backgroundColor: '#D9D9D9',
  },
  userMessage: {
    backgroundColor: '#2F54B2',
  },
  botText: {
    color: '#001E2F',
  },
  userText: {
    color: '#fff',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    paddingBottom: 45,
    borderTopWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingHorizontal: 10,
    backgroundColor: '#f9f9f9',
  },
  sendButton: {
    marginLeft: 10,
    width: 40,
    height: 40,
  },
});

export default Chatbot;
