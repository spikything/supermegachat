import { render, screen, cleanup } from '@testing-library/react';
import Strings from '../../Strings';
import Header from './../Header';

afterEach(cleanup);

it("Displays user's first name, photo and sign out button", () => {
    
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

    expect(screen.getByText(auth.currentUser.displayName.split(' ')[0])).toBeInTheDocument();
    expect(screen.getByText(Strings.SIGN_OUT_LABEL)).toBeInTheDocument();

    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', auth.currentUser.photoURL);
});
