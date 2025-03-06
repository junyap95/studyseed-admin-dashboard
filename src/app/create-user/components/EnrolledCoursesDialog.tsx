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
import { useController, useFormContext } from "react-hook-form";
import { UserSchema } from "@/lib/adminSchema";
import { useState } from "react";

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
  } = useFormContext<UserSchema>();
  const { field } = useController({
    control,
    name: "enrolled_courses",
  });
  const [value, setValue] = useState(field.value || []);

  const handleCheckBoxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const course = e.target.value;
    const valueCopy = [...value];
    // update checkbox value
    if (e.target.checked) {
      valueCopy.push(course);
    } else {
      const i = valueCopy.indexOf(course);
      if (i > -1) {
        valueCopy.splice(i, 1);
      }
    }

    // send data to react hook form
    field.onChange(valueCopy);

    // update local state
    setValue(valueCopy);
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
                      checked={value.includes(course)}
                      onChange={(e) => handleCheckBoxChange(e)}
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
