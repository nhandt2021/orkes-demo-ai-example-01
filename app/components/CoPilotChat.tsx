import AndroidOutlinedIcon from "@mui/icons-material/AndroidOutlined";
import Box from "@mui/material/Box";
import ArrowBox, { ArrowBoxProps } from "./ArrowBox";
import { greyText2, purple, userStyle } from "./utils";
import PilotIcon from "./PilotIcon";

export const CoPilotChat = ({
  name = "Moderator",
  time = "Just now",
  ...props
}: ArrowBoxProps & { name?: string; time?: string }) => {
  return (
    <Box sx={{ padding: "7px 0" }}>
      <Box
        sx={{
          marginBottom: "13px",
          paddingRight: "15px",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <ArrowBox {...props} />
      </Box>
      <Box sx={userStyle}>
        <Box sx={{ padding: "0 4px" }}>
          <Box sx={{ fontSize: "12px" }}>{name}</Box>
          <Box
            sx={{
              fontSize: "8px",
              lineHeight: "normal",
              color: greyText2,
            }}
          >
            {time}
          </Box>
        </Box>
        <Box sx={{ color: purple }}>
          <PilotIcon />
        </Box>
      </Box>
    </Box>
  );
};
