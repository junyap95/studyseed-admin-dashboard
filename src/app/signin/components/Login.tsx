"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { adminSchema } from "@/lib/adminSchema";
import { Alert, Box, Button, Stack, TextField } from "@mui/material";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
export default function Login() {
  const router = useRouter();
  const { setIsAuthenticated } = useAuth();

  const {
    register,
    handleSubmit,
    setError,
    setFocus,
    formState: { errors, isValid, isSubmitting },
  } = useForm({
    resolver: zodResolver(adminSchema),
  });

  const onSubmit = async (data: unknown) => {
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error:", errorData.error);
        setError("root", {
          type: "manual",
          message: `${errorData.error}`,
        });
        setFocus("email");
      } else {
        const result = await response.json();
        console.log("Success:", result.message);
        setIsAuthenticated(true);
        router.push("/create-user");
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };

  return (
    <Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack gap={3}>
          <Stack
            gap={3}
            sx={{
              flexDirection: {
                xs: "column",
                md: "row",
              },
            }}
          >
            <TextField
              {...register("email")}
              label="Email"
              variant="outlined"
              error={!!errors.email}
              sx={{ flex: 1 }}
              helperText={errors.email && errors.email.message}
              slotProps={{ htmlInput: { autoComplete: "off" } }}
            />

            <TextField
              {...register("password")}
              label="Password"
              variant="outlined"
              error={!!errors.password}
              sx={{ flex: 1 }}
              helperText={errors.password && errors.password.message}
              slotProps={{ htmlInput: { autoComplete: "off" } }}
            />
          </Stack>
          {errors.root && <Alert severity="error">{errors.root.message}</Alert>}
          <Button disabled={!isValid} variant="contained" type="submit" loading={isSubmitting}>
            Sign In As Admin
          </Button>
        </Stack>
      </form>
    </Box>
  );
}
