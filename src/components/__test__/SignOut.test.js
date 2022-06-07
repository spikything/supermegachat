import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import Strings from '../../Strings';
import SignOut from './../SignOut';

afterEach(cleanup);

it('displays sign out button which calls auth.signOut() when clicked', () => {
    
    const mockCallback = jest.fn();
    const auth = { 
        currentUser: {},
        signOut: mockCallback
    };
    
    render(<SignOut 
        auth={auth}
    />);

    const signOutButton = screen.getByText(Strings.SIGN_OUT_LABEL);
    expect(signOutButton).toBeInTheDocument();

    expect(mockCallback.mock.calls.length).toBe(0);
    fireEvent.click(signOutButton);
    expect(mockCallback.mock.calls.length).toBe(1);
});
