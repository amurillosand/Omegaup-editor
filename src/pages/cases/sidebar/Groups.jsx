import React from "react";
import { Box } from "@chakra-ui/react";
import Group from "./Group";

import { useAppContext } from "../../../App";

const Groups = () => {
  const { groups } = useAppContext();

  return (
    <Box mt={2} mb={10}>
      {groups.map((group) => (
        <Group {...group} key={group.groupId} />
      ))}
    </Box>
  );
};

export default Groups;
