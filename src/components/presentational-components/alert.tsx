import { useState } from "react";
import { Alert, IconButton, Typography, Snackbar } from "@mui/joy";
import {
  CloseRounded,
  CheckCircleOutline as CheckCircleIcon,
  WarningAmberOutlined as WarningIcon,
  ReportOutlined as ReportIcon,
  InfoOutline as InfoIcon,
} from "@mui/icons-material";

export interface AlertMessageProps {
  alertType: "success" | "danger" | "warning" | "primary";
  title?: string | null;
  description?: string | null;
  onAlertClose?: () => void;
}

const AlertMessage = ({
  alertType,
  title,
  description,
  onAlertClose = () => {},
  ...rest
}: AlertMessageProps) => {
  const titleText =
    !title && !description
      ? alertType.charAt(0).toUpperCase() + alertType.slice(1)
      : title;

  const alertValues = [
    { color: "success", icon: <CheckCircleIcon /> },
    { color: "warning", icon: <WarningIcon /> },
    { color: "danger", icon: <ReportIcon /> },
    { color: "neutral", icon: <InfoIcon /> },
  ];

  const { color, icon } =
    alertValues.find((alert) => alert.color === alertType) || alertValues[3];

  return (
    <>
      <div className="hidden lg:block">
        <Alert
          variant="soft"
          color={color as AlertMessageProps["alertType"]}
          startDecorator={icon}
          sx={{
            fontFamily: "ABC Ginto Nord Unlicensed Trial",
            fontSize: "12px",
            fontWeight: "400",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-center",
          }}
          endDecorator={
            <IconButton
              variant="soft"
              color={color as AlertMessageProps["alertType"]}
              onClick={() => onAlertClose()}
            >
              <CloseRounded />
            </IconButton>
          }
          {...rest}
        >
          <div className="flex flex-col items-start ml-6 ">
            <div className="text-start">{titleText}</div>
            <Typography
              level="body-sm"
              sx={{ textAlign: "left", wordBreak: "break-all" }}
            >
              {description}
            </Typography>
          </div>
        </Alert>
      </div>
      <div className="lg:hidden">
        <Snackbar
          open={true}
          autoHideDuration={6000}
          onClose={(event, reason) => {
            if (reason === "clickaway") {
              onAlertClose();
              return;
            }
          }}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          startDecorator={icon}
          variant="soft"
          color={color as AlertMessageProps["alertType"]}
        >
          <Typography level="body-md">{description}</Typography>
        </Snackbar>
      </div>
    </>
  );
};

export default AlertMessage;
