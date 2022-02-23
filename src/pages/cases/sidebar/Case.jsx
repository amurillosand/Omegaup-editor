import React from "react";
import { Badge, Button, HStack } from "@chakra-ui/react";

const Case = (props) => {
  const { name, points, caseId, groupId, defined, shouldShowPoints } = props;

  const [selectedCase, setSelectedCase] = React.useState(0);

  function handleSelectedCase() {
    setSelectedCase({ caseId: caseId, groupId: groupId });
    // if (goUp) {
    //   window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    // }
  }

  return (
    <Button
      variant={"ghost"}
      size={"sm"}
      onClick={() => handleSelectedCase()}
      isActive={selectedCase.caseId === caseId && selectedCase.groupId === groupId}>
      <HStack>
        <span>{name}</span>
        {shouldShowPoints && (
          <Badge colorScheme={defined ? "green" : "blue"}>
            {points.toFixed(2)}
          </Badge>
        )}
      </HStack>
    </Button>
  );
};

export default React.memo(Case);
