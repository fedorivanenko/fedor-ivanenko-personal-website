import { WheelPickerOption } from "@fedor/wheel-picker";
import * as z from "zod";

export const monthOptions: WheelPickerOption[] = [
  { value: "", label: "" },
  { value: "JAN", label: "January" },
  { value: "FEB", label: "February" },
  { value: "MAR", label: "March" },
  { value: "APR", label: "April" },
  { value: "MAY", label: "May" },
  { value: "JUN", label: "June" },
  { value: "JUL", label: "July" },
  { value: "AUG", label: "August" },
  { value: "SEP", label: "September" },
  { value: "OCT", label: "October" },
  { value: "NOV", label: "November" },
  { value: "DEC", label: "December" },
];

export const formSchema = z.object({
  month: z.string().min(1, "Pick a month"),
});
