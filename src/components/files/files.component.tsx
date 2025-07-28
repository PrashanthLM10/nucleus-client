import { CloudUploadOutlined } from "@mui/icons-material";
import {
  Button,
  Alert,
  IconButton,
  Typography,
  Divider,
  LinearProgress,
  Tooltip,
} from "@mui/joy";
import {
  CloseRounded,
  Info,
  ListOutlined,
  CalendarViewMonthOutlined,
} from "@mui/icons-material";
import { FileList } from "./files-list.component.tsx";
import axios from "axios";
import {
  useEffect,
  useState,
  useRef,
  type ChangeEvent,
  useCallback,
} from "react";
import { getAPIURLWithPath } from "../../utils/api-utils.ts";
import AlertMessage, {
  AlertMessageProps,
} from "../presentational-components/alert.tsx";
import {
  selectRenderType,
  changeRenderType,
  fetchFilesAction,
  setNotification,
  selectNotification,
} from "../../redux/files/slice.ts";
import {
  useAppSelector as useSelector,
  useAppDispatch as useDispatch,
} from "../../redux/store.ts";

import { UploadProgress, NotificationProps } from "./files.types.ts";
import { selectAuthentication } from "../../redux/login/slice.ts";
import { Navigate } from "react-router";

const NotificationContent = () => {
  const dispatch = useDispatch();
  const notification = useSelector(selectNotification);
  const handleAlertClose = useCallback(
    () => dispatch(setNotification(null)),
    []
  );

  if (!notification) return null;

  const { type, data } = notification;
  // If no data is provided, return null
  if (!data) return null;

  // Check if the type is progress or alert and render accordingly
  if (type === "progress") {
    const progress = data as UploadProgress;
    if (progress.state === "uploading" && progress.value > 0) {
      return (
        <div className="flex flex-col items-center gap-2 w-1/2 ml-32 md:ml-40">
          <Typography
            level="body-xs"
            textColor="primary"
            sx={{ fontWeight: "xl", mixBlendMode: "difference" }}
          >
            Uploading... {`${Math.round(Number(progress.value!))}%`}
          </Typography>
          <LinearProgress
            determinate
            variant="solid"
            color="primary"
            size="lg"
            value={Number(progress.value!)}
            className="w-full"
          ></LinearProgress>
        </div>
      );
    }
  }
  if (type === "alert") {
    return (
      <>
        <div className="w-2/5 ml-36 md:ml-44 min-w-sm">
          <AlertMessage
            {...(data as AlertMessageProps)}
            onAlertClose={handleAlertClose}
          />
        </div>
      </>
    );
  }
  return null;
};

const notificationContentData = {
  type: "alert",
  data: {
    alertType: "success",
    title: "Success",
    description: "File uploaded successfully!",
  },
};

const Files = () => {
  const [showAlert, setShowAlert] = useState(true);
  const dispatch = useDispatch();

  const isAuthenticated = useSelector(selectAuthentication);
  const filesRenderType = useSelector(selectRenderType);

  const ipFileRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      axios.get(`${getAPIURLWithPath("maxFileSize")}`).then((res) => {
        sessionStorage.setItem("maxFileSize", res.data.maxFileSize);
      });
    }
  }, []);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  const fileSelected = async (e: ChangeEvent) => {
    const files = (e.target as HTMLInputElement)?.files;
    const formData = new FormData();

    if (files) {
      Array.from(files).forEach((file) => formData.append("file", file));

      try {
        dispatch(
          setNotification({
            type: "progress",
            data: { state: "uploading", value: 0 },
          })
        );
        const response = await axios.post(
          `${getAPIURLWithPath("uploadFile")}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            onUploadProgress: ({ loaded, total }) => {
              dispatch(
                setNotification({
                  type: "progress",
                  data: {
                    state: "uploading",
                    value: Math.round((loaded * 100) / (total || 1)),
                  },
                })
              );
            },
          }
        );

        // throw error if the response is not 200
        if (response.status !== 200) {
          throw new Error(`Upload failed with status ${response.status}`);
        } else {
          dispatch(
            setNotification({
              type: "alert",
              data: {
                alertType: "success",
                description: "File uploaded successfully!",
              },
            })
          );
          dispatch(fetchFilesAction(""));
          if (ipFileRef?.current) ipFileRef.current.value = "";
        }
      } catch (error) {
        dispatch(
          setNotification({
            type: "alert",
            data: {
              alertType: "danger",
              title: "Upload Failed",
              description: `File upload failed: ${
                error instanceof Error ? error.message : "Unknown error"
              }`,
            },
          })
        );
        console.error("Error uploading file:", error);
      }
    }
  };

  return (
    <section className="flex flex-col h-full">
      <section className="flex justify-center">
        {showAlert && (
          <Alert
            variant="soft"
            color="warning"
            className="mt-10 "
            sx={{
              fontFamily: "ABC Ginto Nord Unlicensed Trial",
              fontSize: "12px",
              fontWeight: "400",
            }}
            startDecorator={<Info />}
            endDecorator={
              <IconButton
                variant="soft"
                color="warning"
                onClick={() => setShowAlert(false)}
              >
                <CloseRounded />
              </IconButton>
            }
          >
            The file Url's are only valid for an hour after refresh. If download
            doesn't work. Please refresh and try again.
          </Alert>
        )}
      </section>
      <section className="flex justify-end mx-4 mt-10 mb-4 md:mb-1 items-center">
        <section className="flex-[2] flex justify-center">
          <NotificationContent />
        </section>
        <section className="">
          <IconButton
            color="neutral"
            sx={{ marginRight: 2 }}
            onClick={() =>
              dispatch(
                changeRenderType(filesRenderType === "grid" ? "list" : "grid")
              )
            }
          >
            {filesRenderType === "grid" ? (
              <Tooltip title="Show List view">
                <ListOutlined />
              </Tooltip>
            ) : (
              <Tooltip title="Show Grid view">
                <CalendarViewMonthOutlined />
              </Tooltip>
            )}
          </IconButton>
          <Button
            component="label"
            role={undefined}
            tabIndex={-1}
            variant="outlined"
            color="neutral"
            className="w-32 h-12 md:w-40"
            startDecorator={<CloudUploadOutlined fontSize="medium" />}
          >
            <Typography
              level="body-sm"
              sx={{
                fontFamily: "ABC Ginto Nord Unlicensed Trial",
                fontSize: "16px",
                fontWeight: "400",
              }}
            >
              Upload
            </Typography>
            <input
              type="file"
              hidden
              multiple
              ref={ipFileRef}
              onChange={(e) => fileSelected(e)}
            />
          </Button>
        </section>
      </section>
      <Divider
        sx={{
          "--Divider-childPosition": `50%`,
          fontSize: "16px",
          fontFamily: "ABC Ginto Nord Unlicensed Trial",
        }}
        className="text-xs "
      >
        Files
      </Divider>
      <section className={`m-4 flex-grow`}>
        <FileList />
      </section>
    </section>
  );
};
export default Files;
