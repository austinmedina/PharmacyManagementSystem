import type {PageServerLoad} from "./$types";
import {loadPatients, insertPatient, updatePatient} from "$lib/util";

export const load: PageServerLoad = async ({locals}) => {
    const patients = await loadPatients(locals.db as D1Database);
    return {
        patients: patients
    };
};

export const actions = {
    default: async ({request, locals}) => {
        const data = await request.formData();
        const stringId = data.get("id") as string;
        const firstName = data.get("firstName") as string;
        const lastName = data.get("lastName") as string;
        const dateOfBirth = data.get("dateOfBirth") as string; // Use appropriate type based on your needs
        const email = data.get("email") as string;
        const phone = data.get("phone") as string;
        const insurance = data.get("insurance") === "on"; // Check if checkbox is checked

        const errors: {[key: string]: string} = {}; // Object to hold error messages

        const id = parseInt(stringId);
        // First Name validation
        if (!firstName) {
            errors.firstName = "Missing First Name";
        } else if (typeof firstName !== "string") {
            errors.firstName = "Invalid First Name";
        }

        // Last Name validation
        if (!lastName) {
            errors.lastName = "Missing Last Name";
        } else if (typeof lastName !== "string") {
            errors.lastName = "Invalid Last Name";
        }

        // Date of Birth validation
        const dateOfBirthParsed = new Date(dateOfBirth);
        if (!dateOfBirth) {
            errors.dateOfBirth = "Missing Date of Birth";
        } else if (
            !dateOfBirthParsed ||
            dateOfBirthParsed > new Date(Date.now())
        ) {
            errors.dateOfBirth = "Invalid Date of Birth";
        }

        // Email validation
        const validEmail =
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9]+(-[a-zA-Z0-9]+)*(\.[a-zA-Z0-9]+(-[a-zA-Z0-9]+)*)*\.[a-zA-Z]{2,}$/;
        if (!email) {
            errors.email = "Missing Email";
        } else if (!validEmail.test(email)) {
            errors.email = "Invalid Email";
        }

        // Phone validation
        const validPhone = /^(?:\d{10}|\d{3}-\d{3}-\d{4})$/;
        if (!phone) {
            errors.phone = "Missing Phone";
        } else if (!validPhone.test(phone)) {
            errors.phone = "Invalid Phone";
        }

        // Insurance validation
        if (insurance === undefined) {
            errors.insurance = "Missing Insurance status";
        } else if (typeof insurance !== "boolean") {
            errors.insurance = "Invalid Insurance status";
        }

        if (Object.keys(errors).length > 0) {
            if (id) {
                errors.formKey = "editPatient";
            } else {
                errors.formKey = "newPatient";
            }
            return {
                errors,
                values: {
                    firstName,
                    lastName,
                    dateOfBirth,
                    email,
                    phone,
                    insurance,
                    id
                }
            };
        } else {
            const phoneFormat = /^\d{3}-\d{3}-\d{4}$/;
            let updatedPhone = phone;
            if (phoneFormat.test(phone)) {
                updatedPhone =
                    phone.substring(0, 3) +
                    phone.substring(4, 7) +
                    phone.substring(8);
            }
            if (id) {
                await updatePatient(locals.db as D1Database, {
                    firstName,
                    lastName,
                    dateOfBirth: dateOfBirthParsed,
                    email,
                    phone: updatedPhone,
                    insurance,
                    id
                });

                const _updatedPatient = await locals.db
                    .prepare("SELECT * FROM patients WHERE id = ?")
                    .bind(id)
                    .first(); //will this get used?

                return {
                    success: `${firstName} ${lastName} successfully updated!`,
                    formKey: "editPatient"
                };
            } else {
                await insertPatient(locals.db as D1Database, {
                    firstName,
                    lastName,
                    dateOfBirth: dateOfBirthParsed,
                    email,
                    phone: updatedPhone,
                    insurance
                });

                return {
                    success: `${firstName} ${lastName} successfully added!`,
                    formKey: "createPatient"
                };
            }
        }
    }
};
