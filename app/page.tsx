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
import { Fragment, useEffect, useState } from "react";

const BASE_API_URL = "https://orkes-demo-be.vercel.app";
// const BASE_API_URL = "http://localhost:3001";

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
  const [name, setName] = useState("multiparty_chat");
  const [version, setVersion] = useState("1");
  const [url, setUrl] = useState("https://edition.cnn.com/");
  const [user1, setUser1] = useState("");
  const [user2, setUser2] = useState("");
  const [completedWorkflow, setCompletedWorkflow] = useState<any>(null);

  const runWorkflow = async () => {
    const result = await fetch(`${BASE_API_URL}/run-workflow`, {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      method: "POST",
      body: JSON.stringify({
        workflowName: name,
        workflowVersion: version,
        url,
        ua1: user1,
        ua2: user2,
      }),
    });

    const data = await result.json();

    if (data) {
      setCompletedWorkflow(data);
    }
  };

  const fetchWorkflowExecution = async (workflowId: string) => {
    const result = (await fetch(`${BASE_API_URL}/workflow-exe/${workflowId}`, {
      method: "GET",
    })) as any;

    const data = await result.json();

    setCompletedWorkflow(data);
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
  }, [completedWorkflow]);

  const histories: { role: string; message: string }[] =
    completedWorkflow?.variables?.history || [];

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
            Orkes demo
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
                href={`https://orkesdev.orkesconductor.com/execution/${completedWorkflow?.workflowId}`}
                rel="noreferrer"
                target="_blank"
                ml={1}
              >{`https://orkesdev.orkesconductor.com/execution/${completedWorkflow?.workflowId}`}</Link>
            </Grid>
          )}
        </Grid>
      </Paper>

      <Progress status={completedWorkflow?.status as string} />
      <Paper
        sx={{
          p: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyItems: "center",
          width: "100%",
        }}
      >
        <Box mb={3} sx={{ fontSize: 30, fontWeight: 600 }}>
          Conversation
          {completedWorkflow?.status && (
            <Chip
              color={getChipColor(completedWorkflow?.status)}
              label={completedWorkflow?.status}
              sx={{ ml: 1 }}
            />
          )}
        </Box>
        <Grid
          container
          spacing={2}
          sx={{
            background: "#ffffee",
            // boxShadow: "2px 2px 2px 2px rgba(10,10,10,0.2)",
          }}
        >
          {histories.map((item, index) => {
            return index === 0 ? null : (
              <Fragment key={`history-${index}`}>
                <Grid item xs={2}>
                  {item.role === "assistant" ? "Moderator" : item.role}
                </Grid>
                <Grid item xs={10}>
                  {item.message}
                </Grid>
              </Fragment>
            );
          })}
        </Grid>
      </Paper>
      <Progress status={completedWorkflow?.status as string} sx={{ mt: -4 }} />
    </Box>
  );
}
