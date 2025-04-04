import { Button } from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { motion } from "framer-motion";
import { useState } from "react";

// Define props interface for the component
interface AnimatedButtonProps {
  clickAction: () => void;
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({ clickAction }) => {
  const [animate, setAnimate] = useState(false);

  const animatedClickAction = () => {
    setAnimate(true);
    clickAction();
    setTimeout(() => setAnimate(false), 500);
  };

  // Use the MUI Button directly with a wrapped icon
  return (
    <Button
      variant="contained"
      startIcon={
        <motion.div
          animate={animate ? { rotate: [0, -10, 10, -10, 0], scale: [1, 1.2, 1] } : {}}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          style={{ 
            display: "flex", 
            alignItems: "center",
            justifyContent: "center",
            lineHeight: 0 // Remove any extra line height
          }}
        >
          <DeleteOutlineIcon/>
        </motion.div>
      }
      onClick={animatedClickAction}
      color="warning"
      size="small"
      sx={{ padding: "2px 8px" }}
    >
      Clear All Selections
    </Button>
  );
};

export default AnimatedButton;