import styled from "../utils/styled"
import { headerHeight } from "../utils/constants"

export const SectionHeader = styled("div")(({ theme }) => ({
  fontFamily: theme.font.family.main,
  fontSize: theme.font.size.body,
  fontWeight: theme.font.weight.medium,
  display: "flex",
  alignItems: "center",
  backgroundColor: theme.color.background.lighter,
  color: theme.color.text.dark,
  flex: "0 0", // Make sure it stays the same size if other parts of the card push it

  // This ensures that the card header text and card controls are placed in opposite corners.
  justifyContent: "space-between",
  height: headerHeight,
  padding: `0 ${theme.space.element}px`,
  lineHeight: 1,
}))
