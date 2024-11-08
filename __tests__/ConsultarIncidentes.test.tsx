import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import IncidentDetailScreen from '../src/screens/ConsultarIncidentes';

const mockIncident = {
  id: '1',
  incidentId: 'A123',
  description: 'Test incident',
  categoria: 'test',
  prioridad: 'alta',
  cliente_id: 1,
  fecha_creacion: '2024-11-07T10:00:00Z',
  fecha_cierre: null,
  solucion: 'Solution text',
  identificacion_usuario: '12345',
  radicado: 'R12345',
};

const mockClient = {
  id: 1,
  nombre: 'Test Client',
};

// Mock global fetch function
global.fetch = jest.fn((url) =>
  Promise.resolve({
    ok: true,
    json: async () => {
      // Return different responses based on the URL being fetched
      if (url.includes('/incidente/radicado')) {
        return mockIncident;
      } else if (url.includes('/clientes')) {
        return [mockClient];
      }
    },
  })
) as jest.Mock;

describe('IncidentDetailScreen', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders correctly', () => {
    const { getByPlaceholderText } = render(<IncidentDetailScreen />);
    expect(getByPlaceholderText('ID del incidente')).toBeTruthy();
  });

  test('updates incidentId state on input change', () => {
    const { getByPlaceholderText } = render(<IncidentDetailScreen />);
    const input = getByPlaceholderText('ID del incidente');
    fireEvent.changeText(input, 'A012M23415');
    expect(input.props.value).toBe('A012M23415');
  });

  test('displays error message if incident not found', async () => {
    // Configura el mock para devolver un error en la respuesta
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
    });

    const { getByPlaceholderText, getByTestId, findByText } = render(<IncidentDetailScreen />);

    const input = getByPlaceholderText('ID del incidente');
    fireEvent.changeText(input, 'NonExistentID');

    const searchButton = getByTestId('search_icon');
    fireEvent.press(searchButton);

    // Verifica que se muestre el mensaje de error
    expect(await findByText('Incidente no encontrado. Por favor, verifique el ID ingresado.')).toBeTruthy();
  });

  test('displays loading state while fetching data', async () => {
    const { getByPlaceholderText, getByTestId } = render(<IncidentDetailScreen />);

    const input = getByPlaceholderText('ID del incidente');
    fireEvent.changeText(input, 'A012M23415');

    const searchButton = getByTestId('search_icon');
    fireEvent.press(searchButton);

    // Puedes añadir un estado de carga en el componente y verificarlo aquí
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(2));
  });
});
