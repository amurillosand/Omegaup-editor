import React from "react";
import { Badge, Button, HStack } from "@chakra-ui/react";

import { useCaseContext } from "../CasesWindow";

const Case = (props) => {
  const { selected, setSelected } = useCaseContext();
  const { caseInfo, shouldShowPoints } = props;

  function handleSelectedCase() {
    setSelected(caseInfo);

    // if (goUp) {
    //   window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    // }
  }

  return (
    <Button
      variant={"ghost"}
      size={"sm"}
      onClick={() => handleSelectedCase()}
      isActive={selected.caseId === caseInfo.caseId && selected.groupId === caseInfo.groupId}>
      <HStack>
        <span> {caseInfo.name} </span>
        {shouldShowPoints && (
          <Badge colorScheme={caseInfo.defined ? "green" : "blue"}>
            {caseInfo.points.toFixed(2)}
          </Badge>
        )}
      </HStack>
    </Button>
  );
};

export default React.memo(Case);
