"use client";
import { Box, Typography } from "@mui/material";
import { ZodUserSchema, userSchema } from "@/lib/adminSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";
import { Suspense, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import CreateUserForm from "./components/CreateUserForm";
import { useLocalStorage } from "usehooks-ts";
import BasicContainer from "@/components/BasicContainer";
import Loading from "./loading";
import dynamic from "next/dynamic";

const UserTable = dynamic(() => import("@/components/UserTable"), {
  loading: () => <Loading />,
  ssr: false,
});

export default function CreateUser() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [userArray] = useLocalStorage<ZodUserSchema[]>("new-users", []);
  console.log("create user form ", isAuthenticated, isLoading);

  useEffect(() => {
    if (isAuthenticated === false && !isLoading) {
      router.push("/");
    }
  }, [isAuthenticated, isLoading, router]);

  const methods = useForm<ZodUserSchema>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      enrolled_courses: [],
      courses: ["LITERACY", "NUMERACY"],
    },
    mode: "onChange",
  });

  return (
    <FormProvider {...methods}>
      <Box
        sx={{
          display: "flex",
          px: 3,
          py: 2,
          gap: 2,
          flex: 1,
        }}
      >
        <CreateUserForm />

        <BasicContainer sx={{ p: 3, gap: 3 }}>
          <Typography variant="h5">Newly Added Users</Typography>
          <Suspense fallback={<Loading />}>
            <UserTable userArray={userArray} />
          </Suspense>
        </BasicContainer>
      </Box>
    </FormProvider>
  );
}
