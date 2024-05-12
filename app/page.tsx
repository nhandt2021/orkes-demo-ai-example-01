"use client";

import {
  Box,
  Button,
  Chip,
  Grid,
  LinearProgress,
  LinearProgressProps,
  Paper,
  TextField,
  Link,
} from "@mui/material";
import { useRouter, usePathname } from "next/navigation";
import { Fragment, useEffect, useMemo, useState } from "react";
import { CoPilotChat } from "./components/CoPilotChat";
import { UserChat } from "./components/UserChat";
import {
  blue,
  calculateMissingTimeSlots,
  getLastItem,
  green,
  white,
} from "./components/utils";
import TypingEffect from "./components/TypingEffect";

const BASE_API_URL = "https://orkes-demo-be.vercel.app";
// const BASE_API_URL = "http://localhost:3001";
const CONDUCTOR_URL = "https://play.orkes.io";
const WORKFLOW_NAME = "multiparty_chat";
const WORKFLOW_VERSION = "1";

let timeoutId: NodeJS.Timeout;

const Progress = ({
  status,
  ...restProps
}: LinearProgressProps & { status?: string }) => {
  return status === "RUNNING" ? (
    <LinearProgress
      {...restProps}
      sx={{ width: "100%", mb: -4, ...restProps.sx }}
    />
  ) : null;
};

const getChipColor = (status: string) => {
  switch (status) {
    case "RUNNING":
      return "info";

    case "COMPLETED":
      return "success";

    default:
      return "error";
  }
};

export default function Home() {
  const router = useRouter();
  const pathNames = usePathname();

  const workflowId = useMemo(() => pathNames.split("/")?.[1], [pathNames]);

  const [url, setUrl] = useState("https://edition.cnn.com/");
  const [user1, setUser1] = useState("");
  const [user2, setUser2] = useState("");
  const [completedWorkflow, setCompletedWorkflow] = useState<any>(null);
  const [startTime, setStartTime] = useState<number>(0);
  const [updateTime, setUpdateTime] = useState<number>(0);

  const runWorkflow = async () => {
    const result = await fetch(`${BASE_API_URL}/run-workflow`, {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      method: "POST",
      body: JSON.stringify({
        workflowName: WORKFLOW_NAME,
        workflowVersion: WORKFLOW_VERSION,
        url,
        ua1: user1,
        ua2: user2,
      }),
    });

    const data = await result.json();

    if (data) {
      setCompletedWorkflow(data);
      router.push(`/${data?.workflowId}`);
    }
  };

  const fetchWorkflowExecution = async (workflowId: string) => {
    const result = (await fetch(`${BASE_API_URL}/workflow-exe/${workflowId}`, {
      method: "GET",
    })) as any;

    const data = await result.json();

    setCompletedWorkflow(data);

    if (data?.startTime) {
      setStartTime(data?.startTime);
    }

    if (data?.updateTime) {
      setUpdateTime(data?.updateTime);
    }
  };

  useEffect(() => {
    if (completedWorkflow?.status === "RUNNING") {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      timeoutId = setTimeout(() => {
        fetchWorkflowExecution(completedWorkflow?.workflowId);
      }, 2000);
    }

    if (completedWorkflow?.input?.url) {
      setUrl(completedWorkflow?.input?.url);
    }

    if (completedWorkflow?.input?.ua1) {
      setUser1(completedWorkflow?.input?.ua1);
    }

    if (completedWorkflow?.input?.ua2) {
      setUser2(completedWorkflow?.input?.ua2);
    }
  }, [completedWorkflow]);

  useEffect(() => {
    if (workflowId) {
      fetchWorkflowExecution(workflowId);
    }
  }, [workflowId]);

  const histories: {
    role: string;
    message: string | { result: string; user: string };
  }[] = useMemo(
    () => completedWorkflow?.variables?.history || [],
    [completedWorkflow]
  );

  const missingTimeSlots = calculateMissingTimeSlots(
    startTime,
    updateTime,
    histories.length
  );

  return (
    <Box
      sx={{
        p: 8,
        display: "flex",
        alignItems: "center",
        justifyItems: "center",
        flexDirection: "column",
        gap: 4,
      }}
    >
      <Paper
        sx={{
          p: 4,
          display: "flex",
          alignItems: "center",
          justifyItems: "center",
          width: "100%",
        }}
      >
        <Grid container spacing={3}>
          <Grid
            item
            xs={12}
            sx={{ textAlign: "center", fontSize: 40, fontWeight: 800 }}
          >
            Multi Agent Chat Demo
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              required
              variant="outlined"
              label="URL"
              placeholder="URL"
              value={url}
              error={!url}
              onChange={(event) => setUrl(event.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              required
              variant="outlined"
              label="First participant"
              placeholder="First participant"
              value={user1}
              error={!user1}
              onChange={(event) => setUser1(event.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              required
              variant="outlined"
              label="Second participant"
              placeholder="Second participant"
              value={user2}
              error={!user2}
              onChange={(event) => setUser2(event.target.value)}
            />
          </Grid>
          <Grid item xs={2}>
            <Button
              variant="contained"
              onClick={() => {
                runWorkflow();
              }}
              sx={{ height: "100%", px: 5 }}
              disabled={!url || !user1 || !user2}
            >
              OK
            </Button>
          </Grid>
          {completedWorkflow?.workflowId && (
            <Grid item xs={12}>
              Workflow execution:
              <Link
                href={`${CONDUCTOR_URL}/execution/${completedWorkflow?.workflowId}`}
                rel="noreferrer"
                target="_blank"
                ml={1}
              >{`${CONDUCTOR_URL}/execution/${completedWorkflow?.workflowId}`}</Link>
            </Grid>
          )}
        </Grid>
      </Paper>

      <Paper
        sx={{
          p: 4,
          display: "flex",
          flexDirection: "column",
          width: "100%",
        }}
      >
        <Box mb={3} sx={{ fontSize: 30, fontWeight: 600, textAlign: "center" }}>
          Conversation
          {completedWorkflow?.status && (
            <Chip
              color={getChipColor(completedWorkflow?.status)}
              label={completedWorkflow?.status}
              sx={{ ml: 1 }}
            />
          )}
        </Box>
        <Grid container spacing={2}>
          {histories.map((item, index) => {
            const dateTime = new Date(missingTimeSlots[index]);
            const displayTime = dateTime.toLocaleString();

            return index === 0 ? null : (
              <Fragment key={`history-${index}`}>
                {item.role === "assistant" ? (
                  <Grid item xs={12}>
                    <CoPilotChat
                      position="left"
                      time={displayTime}
                      name={
                        typeof item.message === "object"
                          ? item.message?.user
                          : undefined
                      }
                    >
                      {typeof item.message === "string"
                        ? item.message
                        : item.message?.result}
                    </CoPilotChat>
                  </Grid>
                ) : (
                  <Grid item xs={12}>
                    <UserChat
                      position="right"
                      backgroundColor={blue}
                      color={white}
                      time={displayTime}
                      name={
                        typeof item.message === "object"
                          ? item.message?.user
                          : undefined
                      }
                    >
                      {typeof item.message === "string"
                        ? item.message
                        : item.message?.result}
                    </UserChat>
                  </Grid>
                )}
              </Fragment>
            );
          })}
        </Grid>

        {completedWorkflow?.status === "RUNNING" && (
          <Grid item xs={12} display="flex">
            <CoPilotChat
              position="left"
              backgroundColor={green}
              name="Someone is typing"
            >
              <TypingEffect />
            </CoPilotChat>
          </Grid>
        )}
      </Paper>
    </Box>
  );
}
