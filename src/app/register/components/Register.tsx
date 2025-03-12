import { adminSchema } from "@/lib/adminSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

export default function Register() {
  const [errorMsg, setErrorMsg] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(adminSchema),
  });

  const onSubmit = async (data: unknown) => {
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrorMsg(errorData.error);
        return;
      } else {
        const result = await response.json();
        setErrorMsg(result.message);
        return;
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Register</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="username">Username</label>
          <input id="username" {...register("username")} />
          {errors.username && <span>{errors.username.message}</span>}
        </div>

        <div>
          <label htmlFor="email">Email</label>
          <input id="email" {...register("email")} />
          {errors.email && <span>{errors.email.message}</span>}
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input id="password" type="password" {...register("password")} />
          {errors.password && <span>{errors.password.message}</span>}
        </div>

        <button type="submit">Submit</button>
      </form>
      {!!errorMsg && <div>{errorMsg}</div>}
    </div>
  );
}
