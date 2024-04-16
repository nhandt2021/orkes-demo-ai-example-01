"use client";

import {
  Box,
  Button,
  Chip,
  Grid,
  LinearProgress,
  Paper,
  TextField,
} from "@mui/material";
import { Fragment, useEffect, useState } from "react";

const BASE_API_URL = "https://orkes-demo-be.vercel.app";

let timeoutId: NodeJS.Timeout;

export default function Home() {
  const [name, setName] = useState("multiparty_chat");
  const [version, setVersion] = useState("1");
  const [url, setUrl] = useState("https://edition.cnn.com/");
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
          <Grid item xs={10}>
            <TextField
              fullWidth
              variant="outlined"
              label="URL"
              placeholder="URL"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
            />
          </Grid>
          <Grid item xs={2}>
            <Button
              variant="contained"
              onClick={() => {
                runWorkflow();
              }}
              sx={{ height: "100%", px: 5 }}
            >
              OK
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {completedWorkflow?.status === "RUNNING" && (
        <LinearProgress sx={{ width: "100%", mb: -4 }} />
      )}
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
          History
          {completedWorkflow?.status && (
            <Chip
              color={
                completedWorkflow?.status === "COMPLETED" ? "success" : "error"
              }
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
            return (
              <Fragment key={`history-${index}`}>
                <Grid item xs={2}>
                  {item.role}
                </Grid>
                <Grid item xs={10}>
                  {item.message}
                </Grid>
              </Fragment>
            );
          })}
        </Grid>
      </Paper>
    </Box>
  );
}
