import { cleanup } from '@testing-library/react';
import React from 'react';
import ReactDOM from 'react-dom';
import ChatRoom from './../ChatRoom';
import Settings from './../../Settings';

const firebasemock = require('firebase-mock');
const mockauth = new firebasemock.MockAuthentication();
const mockfirestore = new firebasemock.MockFirestore();
const mocksdk = new firebasemock.MockFirebaseSdk(null, () => mockauth, () => mockfirestore, null, null);

beforeEach(() => {
    jest.clearAllMocks();
});

afterEach(cleanup);

it('renders without errors', () => {
    const div = document.createElement('div');
    
    ReactDOM.render(<ChatRoom 
        Settings={Settings}
        auth={mockauth}
        firebase={mocksdk}
        firestore={mockfirestore}
    />, div);
});
