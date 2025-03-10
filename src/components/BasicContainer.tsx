import { Stack, SxProps, Theme } from "@mui/material";
import React from "react";

export default function BasicContainer({
  children,
  sx,
}: Readonly<{
  children: React.ReactNode;
  sx?: SxProps<Theme>;
}>) {
  return (
    <Stack
      sx={{
        boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
        border: "1px solid rgba(51, 51, 51, 0.3)",
        borderRadius: 3,
        width: {
          xs: "100%",
          md: "600px",
        },
        flex: 1,
        ...sx,
      }}
    >
      {children}
    </Stack>
  );
}
