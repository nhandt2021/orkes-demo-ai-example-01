import Box from "@mui/material/Box";
import InsertEmoticonOutlinedIcon from "@mui/icons-material/InsertEmoticonOutlined";
import ArrowBox, { ArrowBoxProps } from "./ArrowBox";
import { greyText2, purple, userStyle } from "./utils";

export const UserChat = ({
  name = "Participant",
  time = "1 min ago",
  ...props
}: ArrowBoxProps & { name?: string; time?: string }) => {
  return (
    <Box sx={{ padding: "7px 0" }}>
      <Box
        sx={{
          // width: "90%",
          marginBottom: "13px",
          paddingLeft: "15px",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <ArrowBox {...props} />
      </Box>
      <Box sx={{ ...userStyle, justifyContent: "flex-end" }}>
        <Box
          sx={{
            color: purple,
          }}
        >
          <InsertEmoticonOutlinedIcon sx={{ width: "20px" }} />
        </Box>
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
      </Box>
    </Box>
  );
};
