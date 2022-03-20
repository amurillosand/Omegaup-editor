import React from "react"
import { Box, Center, HStack, IconButton, Textarea } from "@chakra-ui/react";

const TextArea = (props) => {
  const { description, value } = props;

  return (
    <Box w={"100%"} h={"100%"} ml={3} mr={3}>
      <Center mb={3}>
        <HStack>
          <strong> {description} </strong>
        </HStack>
      </Center>

      <Textarea
        isReadOnly={true}
        rows={21}
        style={{
          resize: "none",
          width: "100%",
          height: "100%"
        }}
        value={value}
      />
    </Box>
  );
};

export default TextArea;
