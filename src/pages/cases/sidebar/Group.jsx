// import React from "react";
// import {
//   Badge,
//   Box,
//   Divider,
//   HStack,
//   IconButton,
//   Menu,
//   MenuButton,
//   MenuItem,
//   MenuList,
//   Spacer,
//   Tooltip,
//   useColorModeValue,
//   useDisclosure,
//   Flex,
//   MenuDivider,
// } from "@chakra-ui/react";

// import {
//   HiOutlineDocumentRemove,
//   HiOutlineDotsVertical as Dots,
// } from "react-icons/hi";

// import { useMediaPredicate } from "react-media-hook";

// import { useState } from "react";
// import { motion } from "framer-motion";

// import {
//   ChevronDownIcon,
//   ChevronUpIcon,
//   DeleteIcon,
//   DownloadIcon,
//   EditIcon,
// } from "@chakra-ui/icons";

// // import DeleteGroupCases from "../../../idk/modals/delete/DeleteGroupCases";
// // import EditGroupContainer from "../../../idk/modals/edit/EditGroupContainer";
// // import DeleteGroup from "../../../idk/modals/delete/DeleteGroup";

// import CaseItem from "./Case";
// import { useAppContext } from "../../../AppContext";

// const Group = (props) => {
//   const { name, defined, points, groupId, cases } = props;

//   const [showCases, setShowCases] = useState(name === "sin_grupo");

//   // const inputData = useStoreState((state) => state.input.data);
//   // const problemName = useStoreState((state) => state.title.titleName);

//   const isLargeScreen = useMediaPredicate("(min-width: 830px)");
//   const borderColor = useColorModeValue("gray.200", "gray.600");

//   const {
//     isOpen: isOpenEdit,
//     onOpen: onOpenEdit,
//     onClose: onCloseEdit,
//   } = useDisclosure();

//   const {
//     isOpen: isOpenRemove,
//     onOpen: onOpenRemove,
//     onClose: onCloseRemove,
//   } = useDisclosure();

//   const {
//     isOpen: isOpenRemoveCases,
//     onOpen: onOpenRemoveCases,
//     onClose: onCloseRemoveCases,
//   } = useDisclosure();

//   // This is necessary because otherwise it will toggle when the user clicks on the 3-dots/ menu button
//   function handleCasesToggleClick(event) {
//     let percentage =
//       ((event.pageX - event.currentTarget.offsetLeft) * 100) /
//       event.currentTarget.clientWidth;
//     if (percentage < 80) setShowCases(!showCases);
//   }

//   if (name === "sin_grupo" && cases.length === 0) {
//     return <></>;
//   } else {
//     return (
//       <Flex direction={"column"}>
//         <Box my={2}>
//           <HStack
//             mb={2}
//             cursor={"pointer"}
//             transition={"padding-left 0.1s"}
//             _hover={{
//               borderLeft: "2px",
//               borderColor: `${borderColor}`,
//               paddingLeft: "5px",
//             }}
//             onClick={(event) => handleCasesToggleClick(event)}>

//             <Box>{name}</Box>

//             <Spacer />

//             {name !== "sin_grupo" && (
//               <>
//                 <Tooltip
//                   label={"Estos serán los puntos que obtendrá el usuario si resuelve correctamente el grupo"}>
//                   <Badge colorScheme={defined ? "green" : "blue"} size={"sm"}>
//                     {isLargeScreen ? (
//                       <span> {parseFloat("" + points).toFixed(2) + " pts"}</span>
//                     ) : (
//                       <span>{points && Math.round(points)} </span>
//                     )}
//                   </Badge>
//                 </Tooltip>
//               </>
//             )}

//             <Menu isLazy>
//               <MenuButton
//                 as={IconButton}
//                 icon={<Dots />}
//                 size={"sm"}
//                 syle={{ zIndex: 99 }} />
//               <MenuList>
//                 {name !== "sin_grupo" && (
//                   <>
//                     <MenuItem
//                       icon={<EditIcon />}
//                       fontSize={"sm"}
//                       onClick={onOpenEdit}>
//                       Editar Grupo
//                     </MenuItem>

//                     <MenuItem
//                       icon={<DeleteIcon />}
//                       fontSize={"sm"}
//                       onClick={onOpenRemove}>
//                       Eliminar Grupo
//                     </MenuItem>
//                   </>
//                 )}

//                 <MenuItem
//                   icon={<HiOutlineDocumentRemove />}
//                   fontSize={"sm"}
//                   onClick={onOpenRemoveCases}>
//                   Borrar todos los casos
//                 </MenuItem>

//                 <MenuDivider />
//               </MenuList>
//             </Menu>

//             {/* Modals / Drawers */}
//             <EditGroupContainer
//               {...props}
//               isOpen={isOpenEdit}
//               onClose={onCloseEdit} />

//             <DeleteGroup
//               isOpen={isOpenRemove}
//               onClose={onCloseRemove}
//               groupId={groupId} />

//             <DeleteGroupCases
//               isOpen={isOpenRemoveCases}
//               onClose={onCloseRemoveCases}
//               groupId={groupId}
//               groupName={name} />
//           </HStack>

//           <Divider />
//         </Box>

//         <Box ml={2}>
//           {cases && showCases &&
//             cases.cases.map((element) => (
//               <motion.div
//                 className={name}
//                 initial={{ opacity: 0, y: -20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 style={{ display: "inline-block" }}
//                 key={element.caseId}>
//                 <CaseItem {...element} shouldShowPoints={name === "sin_grupo"} />
//               </motion.div>
//             ))
//           }
//         </Box>
//       </Flex>
//     );
//   }
// };

// export default Group;
