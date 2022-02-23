import React from "react";
import { Box } from "@chakra-ui/react";
import Group from "./Group";

import { useAppContext } from "../../../AppContext";

const Groups = () => {
  const { cases } = useAppContext();

  return (
    <Box mt={2} mb={10}>
      {cases.map((group) => (
        <Group {...group} key={group.groupId} />
      ))}
    </Box>
  );
};

export default Groups;
