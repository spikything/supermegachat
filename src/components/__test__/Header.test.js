import { render, screen, cleanup } from '@testing-library/react';
import React from 'react';
import Settings from '../../Settings';
import Header from './../Header';

afterEach(cleanup);

it('displays user display name, photo and sign out', () => {
    
    const auth = { 
        currentUser: {
            uid:1,
            displayName:'User Display Name',
            photoURL:'UserAvatarImage'
        }
    };
    
    render(<Header 
        auth={auth}
    />);

    expect(screen.getByText(auth.currentUser.displayName)).toBeInTheDocument();
    expect(screen.getByText(Settings.SIGN_OUT_LABEL)).toBeInTheDocument();

    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', auth.currentUser.photoURL);
});
