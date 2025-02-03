"use client";
import { motion } from "framer-motion";
import Card from "./Card";
import { useAnimateIn } from "@/hooks/useAnimateIn";

const AnimatedCard = ({ children, ...props }) => {
  const { ref, controls, variants } = useAnimateIn();

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={variants}
    >
      <Card {...props}>{children}</Card>
    </motion.div>
  );
};

export default AnimatedCard;
