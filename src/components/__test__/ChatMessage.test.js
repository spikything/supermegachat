import { render, screen, cleanup } from '@testing-library/react';
import ChatMessage from './../ChatMessage';

afterEach(cleanup);

it('Renders the message correctly', () => {
    const auth = { currentUser: {uid: 1} };
    const key = Math.random().toString();
    const text = 'Hello world ' + Math.random().toString();
    const message = {
        text: text,
        photoURL: 'UserAvatarImage'
    };
    const last = false;
    
    render(<ChatMessage 
        auth={auth}
        key={key}
        message={message}
        last={last}
    />);

    const label = screen.getByText(text);
    expect(label).toBeInTheDocument();

    const image = screen.getByAltText('avatar');
    expect(image).toHaveAttribute('src', message.photoURL);
});

it('Matches snapshot', () => {

    const auth = { currentUser: {uid: 1} };
    const key = '1';
    const text = 'Hello world';
    const message = {
        text: text,
        photoURL: 'UserAvatarImage'
    };
    const last = false;
    
    const messageComponent = render(<ChatMessage 
        auth={auth}
        key={key}
        message={message}
        last={last}
    />);

      expect(messageComponent).toMatchSnapshot();
  });
  