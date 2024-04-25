import { Box } from "@mui/material";

type ArrowBoxProps = {
  children: any;
  position?: string;
  backgroundColor?: string;
  borderColor?: string;
  color?: string;
};

type ArrowStyleProps = {
  position?: string;
  backgroundColor: string;
  borderColor: string;
  color?: string;
};

const arrowBoxStyle = ({
  backgroundColor,
  borderColor,
  color,
}: ArrowStyleProps) => {
  return {
    borderRadius: "6px",
    padding: "9px 10px",
    fontSize: "15px",
    border: `1px solid ${borderColor}`,
    background: backgroundColor,
    color: color || "#060606",
    position: "relative",
  };
};

const arrowStyle = ({
  position,
  backgroundColor,
  borderColor,
}: ArrowStyleProps) => {
  return {
    width: "20px",
    height: "20px",
    transform: "rotate(-45deg);",
    background: backgroundColor,
    position: "absolute",
    borderWidth: "0px 0px 1px 1px",
    borderStyle: "solid",
    borderColor: borderColor,
    bottom: -9.5,
    ...(position === "right" ? { right: 30 } : { left: 30 }),
  };
};

const ArrowBox = ({
  children,
  position = "left",
  backgroundColor = "#F3F3F3",
  borderColor = "#AFAFAF",
  color,
}: ArrowBoxProps) => {
  return (
    <>
      <Box sx={{ position: "relative" }}>
        <Box
          sx={arrowBoxStyle({
            backgroundColor: backgroundColor,
            borderColor: borderColor,
            color,
          })}
        >
          {children}
        </Box>
        <Box
          sx={arrowStyle({
            position: position,
            backgroundColor: backgroundColor,
            borderColor: borderColor,
          })}
        ></Box>
      </Box>
    </>
  );
};

export type { ArrowBoxProps, ArrowStyleProps };
export default ArrowBox;
