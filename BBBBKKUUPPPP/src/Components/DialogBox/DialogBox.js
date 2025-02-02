import * as React from 'react';
import PropTypes from 'prop-types';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import { CircularProgress } from '@mui/material';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2, 5, 2, 4),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(3, 4),
  },
}));

function BootstrapDialogTitle(props) {
  const { children, onClose, ...other } = props;
  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 15,
            top: 15,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

export default function CustomizedDialogs(props) {
  const { maxWidth, title, cancelBtn, submitBtn, openModal, closeModel, modelData, onSubmit, spinner } = props
  const [fullWidth] = React.useState(true);
  return (
    <BootstrapDialog
      open={openModal}
      fullWidth={fullWidth}
      maxWidth={maxWidth}>
      <BootstrapDialogTitle onClose={closeModel}>
        <strong className='ml-2'>{title}</strong>
      </BootstrapDialogTitle>
      <DialogContent>
        {modelData}
      </DialogContent>
      <DialogActions>
        <Button type='reset' autoFocus variant="outlined" color="error" onClick={closeModel} sx={{ height: '44px' }}>
          {cancelBtn}
        </Button>
        {onSubmit && <Button type='submit' autoFocus variant="contained" sx={{ height: '44px' }} onClick={onSubmit}>
          {spinner ? (<CircularProgress color="inherit" size={20} />) : submitBtn}
        </Button>}
      </DialogActions>
    </BootstrapDialog>
  );
}
