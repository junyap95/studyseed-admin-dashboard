"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { adminSchema, SafeAdminUser, ZodAdminSchema } from "@/lib/adminSchema";

import { useAuth } from "@/context/AuthContext";
import { LoginResponse } from "@/app/api/login/route";
import { useLocalStorage } from "usehooks-ts";
import { DashboardAPIPath } from "@/enums/apiPaths.enum";
import { DashboardPagePath } from "@/enums/pagePaths.enum";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";

export default function Login() {
  const { setIsAuthenticated } = useAuth();
  const [adminProfile, setAdminProfile] = useLocalStorage<SafeAdminUser | null>(
    "admin-profile",
    null,
    {
      serializer: (value) => JSON.stringify(value),
    },
  );

  type LoginError = {
    error: {
      name: string;
      message: string;
      expiredAt: string;
    };
  };

  const {
    handleSubmit,
    setError,
    setFocus,
    control,
    formState: { errors, isValid, isSubmitting },
  } = useForm<ZodAdminSchema>({
    resolver: zodResolver(adminSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: unknown) => {
    try {
      const response = await fetch(DashboardAPIPath.LOGIN, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (!response.ok) {
        const errorData: LoginError = await response.json();

        setError("root", {
          type: "manual",
          message: `${errorData.error}`,
        });
        setFocus("email");
        return;
      }
      const result: LoginResponse = await response.json();
      if (!adminProfile) setAdminProfile(result?.adminUser);
      setIsAuthenticated(true);

      window.location.href = DashboardPagePath.CREATE_NEW_USER;
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 min-w-lg">
      <h1>Administrator Login</h1>

      <div className="flex gap-3">
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <Field>
              <FieldLabel>{field.name}</FieldLabel>
              <Input {...field} placeholder="e.g. jane.doe@gmail.com" />
            </Field>
          )}
        />

        <Controller
          name="password"
          control={control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel>{field.name}</FieldLabel>
              <Input {...field} type="password" />
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />
      </div>
      {errors.root?.message && (
        <span className="text-destructive text-sm" role="alert">
          {errors?.root.message}
        </span>
      )}
      <Button aria-disabled={!isValid} type="submit">
        {isSubmitting ? <Spinner /> : "Sign In As Admin"}
      </Button>
    </form>
  );
}
