import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControlLabel,
  Switch
} from '@mui/material';
import { CardModel as CreditCard } from '../../types';

interface CreateCardDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (card: Omit<CreditCard, '_id'>) => void;
}

const CreateCardDialog: React.FC<CreateCardDialogProps> = ({ open, onClose, onSubmit }) => {
  const [newCard, setNewCard] = useState<Omit<CreditCard, '_id'>>({
    name: [''],
    type: '',
    totalLimit: 0,
    currentLimit: 0,
    payments: [],
    billDate: new Date(),
    isActive: true,
  });

  const handleSubmit = () => {
    onSubmit(newCard);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Create New Card</DialogTitle>
      <DialogContent>
        <TextField
          label="Name"
          value={newCard.name[0]}
          onChange={(e) => setNewCard({ ...newCard, name: [e.target.value] })}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Type"
          value={newCard.type}
          onChange={(e) => setNewCard({ ...newCard, type: e.target.value })}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Total Limit"
          type="number"
          value={newCard.totalLimit}
          onChange={(e) => setNewCard({ ...newCard, totalLimit: Number(e.target.value) })}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Current Limit"
          type="number"
          value={newCard.currentLimit}
          onChange={(e) => setNewCard({ ...newCard, currentLimit: Number(e.target.value) })}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Bill Date"
          type="date"
          value={newCard.billDate.toISOString().split('T')[0]}
          onChange={(e) => setNewCard({ ...newCard, billDate: new Date(e.target.value) })}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />
        <FormControlLabel
          control={
            <Switch
              checked={newCard.isActive}
              onChange={(e) => setNewCard({ ...newCard, isActive: e.target.checked })}
            />
          }
          label="Active"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} color="primary">Create</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateCardDialog;