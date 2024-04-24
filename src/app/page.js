"use client";
import { TextField, Box, Typography, Button } from "@mui/material";
import { useRouter } from "next/navigation";
import React from "react";

function page() {
  const router = useRouter();

  return (
    <Box
      component="section"
      className="flex h-screen justify-center items-center bg-gray-700"
    >
      <Box
        component="section"
        className="flex flex-col items-center space-y-4 rounded-xl pl-10 pr-10 bg-slate-200"
      >
        <Box component="section" className="m-24">
          <Typography variant="h2" className="text-center font-bold" mb={4}>
            User Login
          </Typography>
          <Box component="section" className="flex flex-col gap-6">
            <TextField color="success" label="Username" id="outlined-basic" />
            <TextField color="success" label="Password" id="outlined-basic" />
            <Button
              variant="contained"
              color="success"
              onClick={() => {
                router.push("/dashboard");
              }}
            >
              Login
            </Button>
            <Button
              variant="outlined"
              color="success"
              onClick={() => {
                router.push("/newUser");
              }}
            >
              Need an account?
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default page;
