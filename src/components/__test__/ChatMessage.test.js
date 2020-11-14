import { render, screen, cleanup } from '@testing-library/react';
import React from 'react';
import ChatMessage from './../ChatMessage';

afterEach(cleanup);

it('renders correctly', () => {
    const auth = { currentUser: {uid:1} };
    const key = Math.random().toString();
    const text = 'Hello world ' + Math.random().toString();
    const message = { text: text };
    const last = false;
    
    render(<ChatMessage 
        auth={auth}
        key={key}
        message={message}
        last={last}
    />);

    const label = screen.getByText(text);
    expect(label).toBeInTheDocument();
});