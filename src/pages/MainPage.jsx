import React from "react";
import ReactPlayer from "react-player";
import { Box, Button, Center, HStack, Spacer, Text, VStack, useColorModeValue, Code } from "@chakra-ui/react";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Carousel } from "react-responsive-carousel";

import { BiVideo } from "react-icons/all";
import { AiFillGithub } from "react-icons/ai";
import { AddIcon } from "@chakra-ui/icons";
import { Link } from "react-router-dom";

import "../libs/carouselStyles/carousel.css"; // requires a loader
import main from "../assets/images/main.png";
import writing from "../assets/images/writing.png";
import solution from "../assets/images/solution.png";
import darkMode from "../assets/images/darkMode.png";
import testCaseGenerator from "../assets/images/testCaseGenerator.png";
import LogoAnim from "../assets/videos/cdp.mp4";
import LogoAnimDark from "../assets/videos/cdpdark.webm";

const imgStyle = {
  width: "50%",
  border: "5px solid rgba(0,0,0,0.1)",
  borderRadius: "5px",
  boxShadow: "1px 8px 38px -12px rgba(0,0,0,0.75)",
};

const MainPage = () => {
  const [end, setEnd] = useState(false);
  const [animEnd, setAnimEnd] = useState(false);

  const videoToRender = useColorModeValue(LogoAnim, LogoAnimDark);

  useEffect(() => {
    const showAnim = localStorage.getItem("showAnim");
    if (showAnim === "false") {
      handleVideoEnd();
    }
  }, []);

  function handleVideoEnd() {
    setEnd(true);
    localStorage.setItem("showAnim", "false");
    setTimeout(() => {
      setAnimEnd(true);
    }, 1000);
  }

  return (
    <VStack h={"92vh"}>
      <Center h={"100%"} zIndex={-1}>
        <motion.div
          animate={{ y: end ? "-38vh" : "0px" }}
          transition={{ ease: "easeInOut", duration: 0.5 }}>
          <ReactPlayer
            url={videoToRender}
            muted={true}
            playing={true}
            onEnded={handleVideoEnd}
          />
        </motion.div>
      </Center>

      {animEnd && (
        <>
          <Box pos={"absolute"} top={"18vh"}>
            <motion.div animate={{ opacity: 1 }} initial={{ opacity: 0 }}>
              <VStack h={"70vh"}>
                <Text fontSize={"2xl"} fontWeight={"bold"}>
                  ¡Bienvenido a OmegaUp Editor!
                </Text>

                <Box>
                  <Carousel
                    showStatus={false}
                    showThumbs={false}
                    showIndicators={false}
                    autoPlay={true}
                    infiniteLoop={false}
                    interval={5000}>

                    <div>
                      <img src={main} style={imgStyle} />
                      <Text mt={10}>
                        ¡Crea problemas para OmegaUp con facilidad!
                      </Text>
                    </div>

                    <div>
                      <img src={writing} style={imgStyle} />
                      <Text mt={10}>
                        Redacta problemas y visualiza cómo se va a ver en OmegaUp
                      </Text>
                    </div>

                    <div>
                      <img src={solution} style={imgStyle} />
                      <Text mt={10}>
                        Agrega el código y redacta una solución al problema
                      </Text>
                    </div>

                    <div>
                      <img src={testCaseGenerator} style={imgStyle} />
                      <Text mt={10}>
                        Crea un generador de casos
                      </Text>
                    </div>

                    <div>
                      <img src={darkMode} style={imgStyle} />
                      <Text mt={10}> Prueba el modo oscuro 🌙</Text>
                    </div>
                  </Carousel>
                </Box>

                <Spacer />

                <HStack spacing={10}>
                  <Link to={"editor"}>
                    <Button leftIcon={<AddIcon />} colorScheme={"twitter"}>
                      Crea un problema
                    </Button>
                  </Link>

                  <a
                    href={"https://youtube.com/playlist?list=PL43fZBs80z1OdkZqSZte3vXA-8VKyh_ZZ"}
                    rel="noreferrer"
                    target={"_blank"} >
                    <Button leftIcon={<BiVideo />} colorScheme={"blue"}>
                      Ve los tutoriales
                    </Button>
                  </a>

                  <a
                    href={"https://github.com/Mau-MD/Omegaup-CDP"}
                    rel="noreferrer"
                    target={"_blank"} >
                    <Button
                      leftIcon={<AiFillGithub />}
                      colorScheme={"facebook"}>
                      <Text>
                        Huge thanks to{" "}
                        <code> Mau-MD </code>
                      </Text>
                    </Button>
                  </a>

                </HStack>
              </VStack>

            </motion.div>
          </Box>
        </>
      )}
    </VStack>
  );
};

export default MainPage;
