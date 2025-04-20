import React, { useState } from 'react';
import WhatToDoDialog from './WhatToDoDialog';

export default function ProfileWhatToDoDialog({ open, onClose, onSave, defaultValues }) {
  // This is a wrapper to allow reuse and future extension
  return (
    <WhatToDoDialog open={open} onClose={onClose} onSave={onSave} defaultValues={defaultValues} />
  );
}
