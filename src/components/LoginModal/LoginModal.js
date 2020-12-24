import React, { useState } from 'react';
import Modal from '@material-ui/core/Modal';
import { Button, Input } from '@material-ui/core';

import './LoginModal.css';

function LoginModal({open, close, text, action, getModalStyle, classes}) {  
  const [modalStyle] = useState(getModalStyle);

  const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

  return (
		<Modal className="loginModal" open={open} onClose={() => close(false)}>
			<div style={modalStyle} className={classes.paper}>
				<form className="loginModal__signup">
					<center>
						<img
							className="loginModal_headerImage"
							src="https://instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
							alt=""
						/>
					</center>
					{text === 'Sign Up' ? (
						<Input
							placeholder="username"
							type="text"
							value={username}
							onChange={e => setUsername(e.target.value)}
						/>
					) : null}
					<Input
						placeholder="email"
						type="text"
						value={email}
						onChange={e => setEmail(e.target.value)}
					/>
					<Input
						placeholder="password"
						type="text"
						value={password}
						onChange={e => setPassword(e.target.value)}
					/>
					<Button
            className="loginModal__button"
						type="submit"
            disabled={!email || !password}
						onClick={event =>
							action(event, email, password, username)
            }
					>
						{text}
					</Button>
				</form>
			</div>
		</Modal>
  );
}

export default LoginModal;
