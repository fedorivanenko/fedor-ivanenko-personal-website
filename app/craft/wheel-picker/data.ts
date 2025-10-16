import { WheelPickerProps } from "./component";

export const monthOptions = [
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
    { value: "THR", label: "Trinteber" },
    { value: "FOU", label: "Fourtember" },
  ] satisfies WheelPickerProps["options"];
  
  export const dayPeriodOptions = [
    { value: "AM", label: "AM" },
    { value: "PM", label: "PM" },
  ] satisfies WheelPickerProps["options"];
