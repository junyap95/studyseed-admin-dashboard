"use client";
// import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { adminSchema } from "@/lib/adminSchema";

export default function Login() {
  //   const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
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
        // Handle error accordingly
      } else {
        const result = await response.json();
        console.log("Success:", result.message);
        // Handle success accordingly
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      // Handle unexpected errors
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Login</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Username</label>
          <input {...register("username")} />
          {errors.username && <span>{errors.username.message}</span>}
        </div>

        <div>
          <label>Email</label>
          <input {...register("email")} />
          {errors.email && <span>{errors.email.message}</span>}
        </div>

        <div>
          <label>Password</label>
          <input type="password" {...register("password")} />
          {errors.password && <span>{errors.password.message}</span>}
        </div>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
