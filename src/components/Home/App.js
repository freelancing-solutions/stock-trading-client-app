import React from 'react';
import Auth from '../Auth/Auth'
import './app.css';
import {
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    Container,
    Divider,
    Grid,
    TextField,
    Menu,
    MenuItem, AppBar, Toolbar, IconButton, Typography,

} from '@material-ui/core';
import MenuIcon from "@material-ui/icons/Menu";
import { withStyles } from '@material-ui/core/styles';

export default function App() {
    const handleClick = () => {

    }
    const styles = {
        menuButton: {
            background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
            border: 0,
            borderRadius: 3,
            boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
            color: 'white',
            height: 48,
            padding: '0 30px',
        },
        title: {

        }
    }
  return (
      <Container maxWidth="sm">
          <AppBar position="absolute">
              <Toolbar>
                  <IconButton edge="start" className={styles.menuButton} color="inherit" aria-label="menu">
                      <MenuIcon />
                  </IconButton>
                  <Typography variant="h4" className={styles.title}>
                      PinoyDesk
                  </Typography>
                  <Button color="inherit">Login</Button>
              </Toolbar>
          </AppBar>
      </Container>
  );
}
