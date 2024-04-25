export const purple = "#9157FF";
export const lightPurple = "#c8abff";

export const greyBorder = "#DDDDDD";
export const greyText = "#858585";
export const greyText2 = "#AFAFAF";
export const white = "#FFFFFF";

export const blue = "#1976D2";
export const green = "#9FDCAA";

export const boxStyle = (toggle: boolean) => {
  return {
    position: "fixed",
    left: 15,
    bottom: -4,
    borderRadius: "6px",
    width: "100%",
    maxWidth: "284px",
    maxHeight: "474px",
    height: toggle ? "100%" : "auto",
    boxShadow: "4px 4px 10px 0px rgba(89, 89, 89, 0.41)",
    padding: "4px",
    background: white,
  };
};

export const headerStyle = {
  padding: "10px",
  display: "flex",
  alignItems: "center",
  fontSize: "14px",
  fontWeight: 600,
};

export const controlStyle = {
  fontSize: "8px",
  display: "flex",
  alignItems: "center",
  position: "absolute",
  right: 10,
  cursor: "pointer",
};

export const contentStyle = {
  marginTop: "20px",
  paddingBottom: "6px",
  height: "360px",
  overflow: "auto",
};

export const footerStyle = {
  padding: "10px 7px",
  backgroundImage: "linear-gradient(180deg, white, white)",
};

export const userStyle = {
  display: "flex",
  alignItems: "center",
};

export const arrowBox1Args = {
  children:
    "Create a workflow to send flowers to my mother. Don't spend over $100.",
  position: "right",
  backgroundColor: "#F4EEFF",
  borderColor: purple,
};

export const arrowBox2Args = {
  children: "Here is a workflow template for sending flowers.",
  position: "left",
  backgroundColor: blue,
};

export function getLastItem(array: any[]) {
  if (!Array.isArray(array) || array.length === 0) {
    return undefined;
  }
  return array[array.length - 1];
}

export function calculateMissingTimeSlots(
  startTime: number,
  endTime: number,
  missingTimes: number
): number[] {
  const totalDuration = endTime - startTime;
  const averageDuration = totalDuration / (missingTimes + 1);
  const missingTimeSlots: number[] = [];

  for (let i = 1; i <= missingTimes; i++) {
    const missingTime = startTime + i * averageDuration;
    missingTimeSlots.push(missingTime);
  }

  return missingTimeSlots;
}
