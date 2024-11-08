import React from 'react';
import { render } from '@testing-library/react-native';
import Chatbot from '../src/screens/Chatbot';

describe('Chatbot Screen', () => {
    it('renders correctly', () => {
        const { getByText } = render(<Chatbot />);
        expect(getByText('Chatbot')).toBeTruthy();
    });

    it('has correct styles for container', () => {
        const { getByTestId } = render(<Chatbot />);
        const container = getByTestId('container');
        expect(container.props.style).toMatchObject({
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#fff',
        });
    });

    it('has correct styles for text', () => {
        const { getByText } = render(<Chatbot />);
        const text = getByText('Chatbot');
        expect(text.props.style).toMatchObject({
            fontSize: 24,
            fontWeight: 'bold',
        });
    });
});