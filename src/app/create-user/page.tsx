"use client";
import {
  Stack,
  Button,
  Typography,
  TextField,
  FormControl,
  Box,
  Chip,
  Snackbar,
  Alert,
  SnackbarCloseReason,
  Divider,
} from "@mui/material";
import { UserSchema, userSchema } from "@/lib/adminSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";
import EnrolledCoursesDialog from "./components/EnrolledCoursesDialog";
import { Courses, ProgressModel } from "@/lib/types";
import { SyntheticEvent, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import Image from "next/image";

const initializeProgress = (courses: Courses[]): Partial<ProgressModel> => {
  const initialData = {} as Partial<ProgressModel>; // use type assertion here to tell TS that the empty object will eventually have the shape of ProgressModel

  courses.forEach((course: Courses) => {
    initialData[course] = {
      LITERACY: {},
      NUMERACY: {},
    };
  });
  return initialData;
};

export default function CreateUserForm() {
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [open, setOpen] = useState(false);

  const methods = useForm<UserSchema>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      enrolled_courses: [],
      courses: ["LITERACY", "NUMERACY"],
    },
    mode: "onChange",
  });

  const {
    watch,
    getValues,
    formState: { errors, isValid, isSubmitting },
    reset,
    resetField,
    setFocus,
    setError,
    handleSubmit,
    register,
    setValue,
  } = methods;

  // Watch the values of firstName and lastName fields
  const firstName = watch("first_name");
  const lastName = watch("last_name");
  const userid = watch("userid");
  const enrolledCourses = watch("enrolled_courses");

  const onSubmit = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const formData = getValues();
      const reqBody = {
        ...formData,
        progress: initializeProgress(formData.enrolled_courses as Courses[]),
      };

      const response = await fetch("/api/create-new-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reqBody),
      });

      const responseData = await response.json();

      if (!response.ok) {
        if (response.status === 409) {
          resetField("userid");
          setFocus("userid");
        }
        setError("root", {
          type: "manual",
          message: `${responseData.message}`,
        });
        return;
      }

      console.log(responseData);

      reset();
      setSnackBarOpen(true);
    } catch (error) {
      console.error("Unexpected error:", error);
      // Handle unexpected errors
    }
  };

  const generateRandomLetters = (length: number) => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let result = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters[randomIndex];
    }
    return result;
  };

  const handleAutoGenerate = () => {
    const { first_name, last_name } = getValues();
    const generatedUserId = `${first_name[0].toUpperCase()}${last_name[0].toUpperCase()}01${generateRandomLetters(
      2
    )}`;
    setValue("userid", generatedUserId, { shouldDirty: true, shouldValidate: true });
  };

  const handleSBClose = (event: Event | SyntheticEvent<Event>, reason: SnackbarCloseReason) => {
    if (reason === "clickaway") return;
    setSnackBarOpen(false);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <FormProvider {...methods}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          px: 4,
          py: 2,
          gap: 2,
        }}
      >
        <Box sx={{ width: "100%", justifyItems: "center" }}>
          <Image
            src={"https://ik.imagekit.io/jbyap95/gamified%20learning%20programme.png"}
            alt="Studyseed Logo"
            width={400}
            height={300}
          />
        </Box>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack
            gap={3}
            p={3}
            borderRadius={3}
            sx={{
              backgroundColor: "rgba(229, 229, 229, 0.5)",
              boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              width: {
                xs: "100%",
                md: "600px",
              },
            }}
          >
            <FormControl
              sx={{
                ".MuiFormHelperText-contained": {
                  position: "absolute",
                  top: "100%",
                },
                gap: 3,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 3,
                }}
              >
                <Typography variant="h5">Create User</Typography>
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
                    {...register("first_name")}
                    id="outlined-basic"
                    label="First Name"
                    variant="outlined"
                    error={!!errors.first_name}
                    sx={{ flex: 1 }}
                    helperText={errors.first_name && errors.first_name.message}
                    slotProps={{
                      htmlInput: {
                        autoComplete: "off",
                      },
                    }}
                  />
                  <TextField
                    {...register("last_name")}
                    id="outlined-basic"
                    label="Last Name"
                    variant="outlined"
                    error={!!errors.last_name}
                    sx={{ flex: 1 }}
                    helperText={errors.last_name && errors.last_name.message}
                    slotProps={{
                      htmlInput: {
                        autoComplete: "off",
                      },
                    }}
                  />
                </Stack>

                <Stack direction={"row"} gap={3}>
                  <TextField
                    {...register("userid")}
                    id="outlined-basic"
                    label="User ID"
                    variant="outlined"
                    error={!!errors.userid}
                    helperText={errors.userid && errors.userid.message}
                    slotProps={{
                      inputLabel: { shrink: !!userid },
                      htmlInput: {
                        autoComplete: "off",
                      },
                    }}
                  />

                  <Button
                    variant="contained"
                    sx={{ flex: 1 }}
                    disabled={!firstName || !lastName}
                    onClick={handleAutoGenerate}
                  >
                    Auto-generate
                  </Button>
                </Stack>

                <Divider />

                <Stack direction={"row"} justifyContent={"space-between"}>
                  <Typography variant="h6">Enrolled Courses</Typography>
                  <Button variant="contained" startIcon={<AddIcon />} onClick={handleClickOpen}>
                    Add course
                  </Button>
                </Stack>
                <EnrolledCoursesDialog open={open} handleClose={handleClose} />
                <Stack direction={"row"} gap={1}>
                  {enrolledCourses.map((c) => (
                    <Chip key={c} label={c} />
                  ))}
                </Stack>

                <Button
                  disabled={!isValid}
                  variant="contained"
                  type="submit"
                  loading={isSubmitting}
                >
                  Create New User
                </Button>
                {errors.root && errors.root.message}
              </Box>
            </FormControl>
          </Stack>
        </form>
      </Box>

      <Snackbar
        open={snackBarOpen}
        autoHideDuration={6000}
        onClose={(event, reason) => handleSBClose(event, reason)}
      >
        <Alert severity="success" variant="filled" sx={{ width: "100%" }}>
          New User Registered!
        </Alert>
      </Snackbar>
    </FormProvider>
  );
}
