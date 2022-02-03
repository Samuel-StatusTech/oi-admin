import React, { useState } from 'react';
import { Menu, MenuItem, Button } from '@material-ui/core';
import ArrowDropDown from '@material-ui/icons/ArrowDropDown';

const UserButton = ({ onLogout }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Button
        aria-controls='simple-menu'
        aria-haspopup='true'
        onClick={handleClick}
        style={{ color: '#3B94FF', textTransform: 'capitalize' }}
        endIcon={<ArrowDropDown />}
      >
        Olá, Admin!
      </Button>

      <Menu id='simple-menu' anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={() => onLogout()}>Sair</MenuItem>
      </Menu>
    </>
  );
};

export default UserButton;
