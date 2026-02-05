import { motion } from 'framer-motion';
import { FaLeaf } from 'react-icons/fa';
import styles from './SuccessSprout.module.css';

const SuccessSprout = () => {
  return (
    <motion.div
      className={styles.sproutContainer}
      initial={{ scale: 0, rotate: -20, opacity: 0 }}
      animate={{
        scale: [0, 1.2, 1],
        rotate: [-20, 10, 0],
        opacity: [0, 1, 1, 0],
        y: [0, -15, -20]
      }}
      transition={{
        duration: 2.2,
        times: [0, 0.2, 0.4, 1],
        ease: "easeOut"
      }}
    >
      <FaLeaf className={styles.leafIcon} />
    </motion.div>
  );
};

export default SuccessSprout;
