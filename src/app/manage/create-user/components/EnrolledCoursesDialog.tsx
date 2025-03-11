import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  FormControl,
  DialogActions,
  FormHelperText,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import { ZodUserSchema } from "@/lib/adminSchema";

const courses = ["GES", "GES2"] as const;

export default function EnrolledCoursesDialog({
  open,
  handleClose,
}: {
  open: boolean;
  handleClose: () => void;
}) {
  const {
    control,
    formState: { errors },
  } = useFormContext<ZodUserSchema>();

  const { fields, append, remove } = useFieldArray({ control, name: "enrolled_courses" });
  const fieldArray = useWatch({ control, name: "enrolled_courses" });

  const handleCheckBoxChange = (course: string, checked: boolean) => {
    if (checked) {
      append({ course });
    } else {
      const index = fields.findIndex((field) => field.course === course);
      if (index !== -1) {
        remove(index);
      }
    }
  };

  return (
    <Dialog disableEscapeKeyDown open={open} onClose={handleClose} fullWidth>
      <DialogTitle>Select At Least 1 Course</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexWrap: "wrap" }}>
          <FormControl
            fullWidth
            error={!!errors.enrolled_courses}
            variant="outlined"
            margin="normal"
          >
            <label id="course-select-label">Available Courses</label>
            {courses.map((course) => (
              <Box key={course}>
                <FormControlLabel
                  control={
                    <Checkbox
                      value={course}
                      checked={fieldArray.some((field) => field.course === course)}
                      onChange={(e) => handleCheckBoxChange(course, e.target.checked)}
                    />
                  }
                  label={course}
                />
              </Box>
            ))}
            {errors.enrolled_courses && (
              <FormHelperText>{errors.enrolled_courses.message}</FormHelperText>
            )}
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Done</Button>
      </DialogActions>
    </Dialog>
  );
}
