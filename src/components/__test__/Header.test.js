import { render, screen, cleanup } from '@testing-library/react';
import Strings from '../../Strings';
import Header from './../Header';

const auth = { 
    currentUser: {
        uid:1,
        displayName:'User Display Name',
        photoURL:'UserAvatarImage'
    }
};

afterEach(cleanup);

it("Displays user's first name, photo and sign out button", () => {
    
    render(<Header auth={auth} />);

    expect(screen.getByText(auth.currentUser.displayName.split(' ')[0])).toBeInTheDocument();
    expect(screen.getByText(Strings.SIGN_OUT_LABEL)).toBeInTheDocument();

    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', auth.currentUser.photoURL);
});

it("Matches snapshot", () => {
    const component = render(<Header auth={auth} />);
    expect(component).toMatchSnapshot();
});
