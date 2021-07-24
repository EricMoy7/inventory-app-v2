import React, { FC } from 'react';

import ImportData from '../UI/ImportData/ImportData';
import ImportInventoryForm from '../UI/ImportData/ImportInventoryForm';

import { Container } from '@material-ui/core';

const ImportDataPage: FC = () => {
  return (
    <Container
      style={{
        maxWidth: 'sm',
        padding: '20px',
        marginTop: '20px',
        height: '90vh',
        boxShadow: '0 2px 0 0 #f5f5f5;',
        display: 'block',
      }}
    >
      <ImportData childComp={<ImportInventoryForm />} />
    </Container>
  );
};

export default ImportDataPage;
