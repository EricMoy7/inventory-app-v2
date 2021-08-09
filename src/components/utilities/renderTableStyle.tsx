import React from 'react';
import { User } from '../../store/types';
import { Button } from '@material-ui/core';
import SourcePopper from '../UI/MainInventory/Popper';
import SourceEditorForm from '../UI/MainInventory/SourceEditorForm';

function isIterable(obj: any) {
  // checks for null and undefined
  if (obj == null) {
    return false;
  }
  return typeof obj[Symbol.iterator] === 'function';
}

export function renderTableStyle(colList: any, user: User | null) {
  colList.map((column: { title: string }, idx: string | number) => {
    if (column.title === 'Image') {
      colList[idx] = {
        ...column,
        render: (rowData: {
          [x: string]: string | undefined;
          asin: any;
          imageUrl: string | undefined;
          imageWidth: any;
          imageHeight: any;
        }) => (
          <a href={`https://www.amazon.com/dp/${rowData.asin}`} target="_blank">
            <img
              src={rowData.imageUrl}
              style={{
                width: rowData.imageWidth,
                height: rowData.imageHeight,
              }}
              alt={rowData['Product Name']}
            />
          </a>
        ),
      };
    }

    if (column.title === 'Product Name') {
      colList[idx] = {
        ...column,
        render: (rowData: {
          [x: string]:
            | boolean
            | React.ReactChild
            | React.ReactFragment
            | React.ReactPortal
            | null
            | undefined;
        }) => (
          <tr
            style={{
              width: '200px',
              display: 'inline-block',
              fontSize: 'small',
              fontWeight: 'bold',
            }}
          >
            {rowData['product-name']}
          </tr>
        ),
      };
    }

    if (column.title === 'Supplier') {
      colList[idx] = {
        ...column,
        render: (rowData: any) => (
          <tr>
            {rowData['supplier'] ? (
              Object.keys(rowData['supplier']).map((key: string) => (
                <Button
                  size="small"
                  variant="contained"
                  color="primary"
                  style={{ margin: '5px' }}
                  onClick={() =>
                    window.open(rowData['supplier'][key], '_blank')
                  }
                >
                  {key}
                </Button>
              ))
            ) : (
              <div></div>
            )}
            <SourcePopper
              childComp={<SourceEditorForm msku={rowData.msku} />}
            ></SourcePopper>
          </tr>
        ),
      };
    }
  });

  return colList;
}
