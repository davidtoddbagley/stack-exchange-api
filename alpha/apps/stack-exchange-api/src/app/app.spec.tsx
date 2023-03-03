import { cleanup, getByTestId, getByText, render, screen, waitFor } from '@testing-library/react';
import userEvent from "@testing-library/user-event";
import moment from 'moment';
import React from 'react';
import App from './app';


describe('App', () => {
  afterEach(() => {
    cleanup();
  });

  it('should render Health Check response successfully', async () => {  
    jest.mock('moment', () => {
      return () => jest.requireActual('moment')('2020-01-01T00:00:00.000Z');
    });
    const message = `API Server functional as of ${moment().toISOString()}`;
  
    global['fetch'] = jest.fn().mockResolvedValueOnce({
      json: () => ({
        message,
      }),
    });
  
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { baseElement } = render(<App />) as any;
    await waitFor(() => getByText(baseElement, `Health Check: ${message}`));
  });
});

