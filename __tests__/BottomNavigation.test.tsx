import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { useNavigation } from '@react-navigation/native';
import BottomNavigation from '../src/components/BottomNavigation';

jest.mock('@react-navigation/native', () => {
    return {
        useNavigation: jest.fn(),
    };
});

describe('BottomNavigation', () => {
    const navigate = jest.fn();

    beforeEach(() => {
        (useNavigation as jest.Mock).mockReturnValue({ navigate });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render correctly', () => {
        const { getByText } = render(<BottomNavigation />);
        expect(getByText('Inicio')).toBeTruthy();
        expect(getByText('Crear')).toBeTruthy();
        expect(getByText('Chatbot')).toBeTruthy();
        expect(getByText('Incidentes')).toBeTruthy();
    });

    it('should navigate to Home when Inicio is pressed', () => {
        const { getByText } = render(<BottomNavigation />);
        fireEvent.press(getByText('Inicio'));
        expect(navigate).toHaveBeenCalledWith('Home');
    });

    it('should navigate to UserValidation when Crear is pressed', () => {
        const { getByText } = render(<BottomNavigation />);
        fireEvent.press(getByText('Crear'));
        expect(navigate).toHaveBeenCalledWith('UserValidation');
    });

    it('should navigate to Chatbot when Chatbot is pressed', () => {
        const { getByText } = render(<BottomNavigation />);
        fireEvent.press(getByText('Chatbot'));
        expect(navigate).toHaveBeenCalledWith('Chatbot');
    });

    it('should navigate to ConsultarIncidentes when Incidentes is pressed', () => {
        const { getByText } = render(<BottomNavigation />);
        fireEvent.press(getByText('Incidentes'));
        expect(navigate).toHaveBeenCalledWith('ConsultarIncidentes');
    });
});