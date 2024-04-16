"use client";

import { Box, Button, Grid, Paper, TextField } from "@mui/material";
import { hostname } from "os";
import { useState } from "react";

const BASE_API_URL = "https://orkes-demo-be.vercel.app";

export default function Home() {
  const [token, setToken] = useState("");
  const [name, setName] = useState("");
  // const [version, setVersion] = useState("");
  const [host, setHost] = useState("https://orkesdev.orkesconductor.com/");
  const [isError, setIsError] = useState(false);
  const [data, setData] = useState<any>(null);
  console.debug("🚀 ~ Home ~ data:", data);

  const fetchWorkflow = async () => {
    const result = await fetch(
      `${BASE_API_URL}/workflow/${name}?host=${host}`,
      {
        headers: {
          "x-authorization": token,
        },
        method: "GET",
      }
    );

    const data = await result.json();

    if (data) {
      setData(data);
    }
  };

  const histories: { role: string; message: string }[] =
    data?.variables?.history || [];

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
          <Grid item>Orkes demo</Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              variant="outlined"
              label="Workflow execution id"
              placeholder="Workflow execution id"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              variant="outlined"
              label="Host"
              placeholder="Host"
              value={host}
              onChange={(event) => setHost(event.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              variant="outlined"
              label="Token"
              placeholder="Token"
              value={token}
              onChange={(event) => setToken(event.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              onClick={() => {
                fetchWorkflow();
              }}
            >
              OK
            </Button>
          </Grid>
        </Grid>
      </Paper>
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
        </Box>
        <Grid
          container
          spacing={2}
          sx={{
            background: "#ffffee",
            // boxShadow: "2px 2px 2px 2px rgba(10,10,10,0.2)",
          }}
        >
          {histories.map((item) => {
            return (
              <>
                <Grid item xs={2}>
                  {item.role}
                </Grid>
                <Grid item xs={10}>
                  {item.message}
                </Grid>
              </>
            );
          })}
        </Grid>
      </Paper>
    </Box>
  );
}
