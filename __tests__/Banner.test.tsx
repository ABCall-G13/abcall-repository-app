import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Banner from '../src/components/Banner';
import { NavigationProp } from '@react-navigation/native';

describe('Banner Component', () => {
    const mockNavigation: NavigationProp<any> = {
        navigate: jest.fn(),
        dispatch: jest.fn(),
        goBack: jest.fn(),
        addListener: jest.fn(),
        removeListener: jest.fn(),
        canGoBack: jest.fn(),
        isFocused: jest.fn(),
        getParent: jest.fn(),
        getState: jest.fn(),
        setParams: jest.fn(),
        reset: jest.fn(),
        getId: jest.fn(),
    setOptions: jest.fn(),
};

    it('should render correctly', () => {
        const { getByText } = render(<Banner navigation={mockNavigation} />);
        expect(getByText('Bienvenido a la APP de ABCall')).toBeTruthy();
    });

    it('should navigate to UserValidation when first button is pressed', () => {
        const { getByText } = render(<Banner navigation={mockNavigation} />);
        fireEvent.press(getByText('Aquí podrás crear el incidente'));
        expect(mockNavigation.navigate).toHaveBeenCalledWith('UserValidation');
    });

    it('should navigate to ConsultarIncidentes when second button is pressed', () => {
        const { getByText } = render(<Banner navigation={mockNavigation} />);
        fireEvent.press(getByText('Usa esta función para consultar los incidentes.'));
        expect(mockNavigation.navigate).toHaveBeenCalledWith('ConsultarIncidentes');
    });

    it('should navigate to Chatbot when third button is pressed', () => {
        const { getByText } = render(<Banner navigation={mockNavigation} />);
        fireEvent.press(getByText('Interactua con nuestro chatbot de IA generativa quien te ayudara a resolver tus inquietudes'));
        expect(mockNavigation.navigate).toHaveBeenCalledWith('Chatbot');
    });
});