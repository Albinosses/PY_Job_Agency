import { styled } from "@mui/system";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

export const StyledParagraph = styled(Typography)({
    fontSize: "1.1rem",
    lineHeight: "1.6",
});

export const SkillContainer = styled("div")({
    border: "1px solid #ccc",
    borderRadius: "8px",
    padding: "16px",
    marginTop: "16px",
});

export const Container = styled("div")({
    padding: "16px",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    margin: "0 auto",
});

export const ReturnButton = styled(Button)({
    margin: "16px",
});

export const Title = styled("h2")({
    textAlign: "center",
    marginBottom: "16px",
});
