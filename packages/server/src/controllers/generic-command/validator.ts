import * as yup from "yup";

export const createGenericCommandSchema = yup.object({
    name: yup
        .string()
        .required("Name field is required."),
    output: yup
        .string()
        .required("Output field is required."),
});

export const deleteGenericCommandSchema = yup.object({
    name: yup
        .string()
        .required("Name field is required.")
});
