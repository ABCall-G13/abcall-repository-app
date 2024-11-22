import React, { useState } from 'react';
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

interface Message {
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}

const Chatbot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'bot',
      text: '¡Hola! Soy tu asistente virtual. ¿En qué puedo ayudarte hoy?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]); // Mensaje de bienvenida inicial
  const [userInput, setUserInput] = useState('');

  const handleSendMessage = async () => {
    if (userInput.trim() === '') return;

    const newMessages: Message[] = [
      ...messages,
      { sender: 'user', text: userInput, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
    ];
    setMessages(newMessages);
    setUserInput('');

    try {
      const response = await axiosInstance.post('/search-issues', { query: userInput });
      setMessages([
        ...newMessages,
        {
          sender: 'bot',
          text: response.data[0]?.solucion || 'No se encontró una solución.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (error) {
      console.error('Error:', error);
      setMessages([
        ...newMessages,
        {
          sender: 'bot',
          text: 'Lo siento, hubo un error.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
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
          source={require('../../assets/logo.png')} // Cambia por la ruta de tu logo
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
      keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 50} // Ajusta para evitar superposición
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
                style={styles.sendButton}/>
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
    paddingBottom:45,
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
    paddingHorizontal: 15,
    justifyContent: 'center',
    borderRadius: 20,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Chatbot;
