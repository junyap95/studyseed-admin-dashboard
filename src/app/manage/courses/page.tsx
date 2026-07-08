import { CourseBuilderProvider } from "@/context/CourseBuilderContext";
import CourseBuilder from "./components/CourseBuilder";

export default function ManageCoursesPage() {
  return (
    <CourseBuilderProvider>
      <CourseBuilder />
    </CourseBuilderProvider>
  );
}
