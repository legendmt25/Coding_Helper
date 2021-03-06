import {
  Box,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Tooltip,
} from '@mui/material';
import { useContext, useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { AppContext } from '../App';
import repository, { domain } from '../repository/repository';
import { shadow } from './styles';
import { setAuthenticationAvatarImage } from './utility';
import MenuIcon from '@mui/icons-material/Menu';

const optionStyle = (theme) => {
  return {
    color: 'black',
    transition: 'all',
    transitionDuration: '200ms',
    py: 2,
    ':hover': {
      color: 'white',
      backgroundColor: '#d0d3d4',
    },
  };
};

export default function Account() {
  const links = ['Settings', 'Notifications'];
  const ctx = useContext(AppContext);
  const [displayMenu, setDisplayMenu] = useState(false);

  const handleAddImage = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.click();
    input.addEventListener('change', () => {
      const formData = new FormData();
      formData.append('file', input.files[0]);
      formData.append('email', ctx.userDetails.email);
      repository.uploadAvatar(formData).then((data) => {
        setAuthenticationAvatarImage(data.avatarImage);
        ctx.setUserDetails({
          ...ctx.userDetails,
          avatarImage: data.avatarImage,
        });
      });
    });
  };

  const toggleDisplayMenu = (event) => setDisplayMenu(!displayMenu);

  return (
    <Box
      sx={{ display: 'flex', gap: 13, flexDirection: 'column', width: '100%' }}
    >
      <Box
        sx={{
          height: '14rem',
          backgroundColor: 'white',
          position: 'relative',
          boxShadow: shadow,
        }}
      >
        <Tooltip title="Click to change">
          <Box
            component={'span'}
            sx={{
              position: 'absolute',
              bottom: 0,
              left: { xs: '50%', md: '5%' },
              borderRadius: '50%',
              transform: {
                xs: 'translate(-50%, 50%)',
                md: 'translate(0, 50%)',
              },
            }}
          >
            <img
              src={`${domain}/public/avatars/${
                ctx.userDetails
                  ? ctx.userDetails.avatarImage
                  : 'defaultUser.png'
              }`}
              alt={'user avatar'}
              onClick={handleAddImage}
              style={{
                objectFit: 'contain',
                borderRadius: 'inherit',
                height: '10rem',
                boxShadow: shadow,
              }}
            />
          </Box>
        </Tooltip>
      </Box>
      <Box
        sx={{
          backgroundColor: 'white',
          borderRadius: 1,
          boxShadow: shadow,
          display: 'flex',
          gap: 2,
          py: 3,
          px: 1,
          flex: '1 1 100%'
        }}
      >
        <Box
          sx={{
            backgroundColor: 'silver',
            borderRadius: 0.5,
            display: { xs: 'none', md: 'flex' },
            gap: 0,
            flexDirection: 'column',
            textAlign: 'center',
            flex: 0.2,
            boxShadow: shadow,
          }}
        >
          {links.map((link, index) => (
            <Link
              key={index}
              to={`/account/${link.toLowerCase()}`}
              style={{ textDecoration: 'none' }}
            >
              <Box sx={optionStyle}>{link}</Box>
            </Link>
          ))}
        </Box>
        <Button
          onClick={toggleDisplayMenu}
          sx={{ display: { xs: 'block', md: 'none' } }}
        >
          <MenuIcon></MenuIcon>
        </Button>
        <Drawer open={displayMenu} onClick={toggleDisplayMenu}>
          <List>
            {links.map((link) => (
              <ListItem button onClick={toggleDisplayMenu}>
                <Link
                  to={`/account/${link}`}
                  style={{
                    textDecoration: 'none',
                    color: 'inherit',
                    padding: '5px 40px',
                  }}
                >
                  <ListItemText primary={link}></ListItemText>
                </Link>
              </ListItem>
            ))}
          </List>
        </Drawer>
        <Box sx={{ flex: 1 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
