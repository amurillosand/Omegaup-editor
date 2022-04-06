import React from 'react';
import { Alert } from "@chakra-ui/react";

function AlertDismissable(props) {
  const { show, error } = props;

  return (
    <>
      {show && (
        <Alert bsStyle="danger" onDismiss={show}>
          <p style={{
            whiteSpace: 'pre-wrap',
            wordSpacing: '4px'
          }}>
            {error.title + "\n" + error.description}
          </p>
        </Alert>
      )}
    </>
  );
}

export default AlertDismissable;