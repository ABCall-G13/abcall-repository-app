import React, { useState, useEffect } from 'react';
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

const Chatbot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'bot',
      text: (
        <Text>
          ¡Hola! Soy tu asistente virtual.{"\n"}
          Por favor, ingresa tu tipo de documento.{"\n"}
          Las opciones son:{"\n"}
          <Text style={{ fontWeight: 'bold' }}>- CC:</Text> Cédula de ciudadanía{"\n"}
          <Text style={{ fontWeight: 'bold' }}>- PP:</Text> Pasaporte{"\n"}
          <Text style={{ fontWeight: 'bold' }}>- CE:</Text> Cédula de extranjería{"\n"}
          <Text style={{ fontWeight: 'bold' }}>- NIT:</Text> Número de Identificación Tributaria
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

  // Obtener la lista de clientes al cargar el componente
  useEffect(() => {
    axiosInstance
      .get('/clientes')
      .then((response) => setClientes(response.data))
      .catch((error) => console.error('Error al obtener los clientes:', error));
  }, []);

  const handleSendMessage = async () => {
    if (userInput.trim() === '') {
      return;
    }

    const newMessages: Message[] = [
      ...messages,
      { sender: 'user', text: userInput, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
    ];
    setMessages(newMessages);
    setUserInput('');

    if (isAskingProblem) {
      // Buscar soluciones al problema en el endpoint
      try {
        const response = await axiosInstance.post('/search-issues', { query: userInput });
        const solutions = response.data || [];

        if (solutions.length > 0) {
          const solutionsText = solutions
            .slice(0, 3)
            .map((solution: any, index: number) => `${index + 1}. ${solution.solucion}`)
            .join('\n');

          setMessages([
            ...newMessages,
            {
              sender: 'bot',
              text: `Estas son algunas posibles soluciones:\n${solutionsText}`,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            },
          ]);
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
      const validDocTypes = ['CC', 'PP', 'CE', 'NIT'];
      if (!validDocTypes.includes(userInput.toUpperCase())) {
        setMessages([
          ...newMessages,
          {
            sender: 'bot',
            text: (
              <Text>
                Tipo de documento no válido. Por favor, ingresa uno de los siguientes:{"\n"}
                <Text style={{ fontWeight: 'bold' }}>- CC:</Text> Cédula de ciudadanía{"\n"}
                <Text style={{ fontWeight: 'bold' }}>- PP:</Text> Pasaporte{"\n"}
                <Text style={{ fontWeight: 'bold' }}>- CE:</Text> Cédula de extranjería{"\n"}
                <Text style={{ fontWeight: 'bold' }}>- NIT:</Text> Número de Identificación Tributaria
              </Text>
            ),
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
        return;
      }
      setDocType(userInput.toUpperCase());
      setMessages([
        ...newMessages,
        { sender: 'bot', text: 'Por favor, ingresa tu número de identificación.', timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
      ]);
      return;
    }

    if (!docNumber) {
      if (isNaN(Number(userInput))) {
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
      setDocNumber(userInput);
      setMessages([
        ...newMessages,
        {
          sender: 'bot',
          text: (
            <Text>
              Selecciona el cliente asociado escribiendo el número correspondiente de la lista:{"\n"}
              {clientes.map((cliente, index) => (
                <Text key={cliente.id}>
                  <Text style={{ fontWeight: 'bold' }}>{index + 1}:</Text> {cliente.nombre}{"\n"}
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
      const clientIndex = parseInt(userInput) - 1; // Convertir la entrada del usuario al índice
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

      // Enviar datos al endpoint de validación
      try {
        const response = await axiosInstance.get('/usuario', {
          params: {
            doc_type: docType,
            doc_number: docNumber,
            client: clienteSeleccionado.nit,
          },
        });

        if (response.data) {
          setMessages([
            ...newMessages,
            {
              sender: 'bot',
              text: 'Usuario autenticado correctamente. Por favor, describe el problema que estás presentando.',
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            },
          ]);
          setIsAskingProblem(true); // Cambiar estado para preguntar por el problema
        } else {
          setMessages([
            ...newMessages,
            {
              sender: 'bot',
              text: 'Lo siento, no se pudo autenticar para tener asistencia.',
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            },
          ]);
        }
      } catch (error) {
        console.error('Error durante la autenticación:', error);
        setMessages([
          ...newMessages,
          {
            sender: 'bot',
            text: 'Hubo un error al procesar la autenticación. Inténtalo nuevamente.',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
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
